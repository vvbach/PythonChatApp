
from app.core.security import get_password_hash, verify_password
from app.serializers import serializers
from app.models.user import UserModel
from fastapi import status, HTTPException
from app import schemas
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.exceptions import UserCreationError
from app.core.config import settings


class BaseUserManager:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.user_collection = self.db[settings.USERS_COLLECTION]

    async def get_by_id(self, id: str) -> schemas.UserInDb:
        user = await self.user_collection.find_one({'id': id})
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f'User not found')
        return user

    async def get_by_email(self, email: str) -> schemas.UserInDb:
        user = await self.user_collection.find_one({'email': email})
        return user

    async def get_all(self) -> list[schemas.User]:
        cursor = self.user_collection.find({})
        users = await cursor.to_list(length=None)

        serialized_users = []
        # so we need to serialize it
        for user in users:
            serialized_user = serializers.user_serializer(user)
            serialized_users.append(serialized_user)

        return serialized_users

    async def get_all_except_me(self, current_user_id: str) -> list[schemas.User]:
        all_users = await self.get_all()
        return [user for user in all_users if user.id != current_user_id]

    async def insert_private_message_recipient(
            self,
            user_id: str,
            recipient_model: schemas.MessageRecipient
    ):
        result = await self.user_collection.update_one(
            {'id': user_id},
            {'$push': {'private_message_recipients': recipient_model.model_dump()}}
        )
        if result.matched_count == 1 and result.modified_count == 1:
            return True


class UserDBManager(BaseUserManager):
    async def authenticate(self, user_data: schemas.Login) -> schemas.UserInDb:
        user = await self.get_by_email(user_data.email)
        # print('user', user)
        if not user:
            return None
        elif not verify_password(user_data.password, user.get('password')):
            return None
        return user


class UserCreator(BaseUserManager):
    async def create_user(self, user_data: schemas.UserCreate) -> schemas.User:
        try:
            existing_user = await self.get_by_email(user_data.email)
            if existing_user:
                raise UserCreationError('Email', 'Email already in use!')
            password_hash = get_password_hash(user_data.password1)

            updated_user_data = {
                **user_data.model_dump(),
                'password': password_hash
            }
            new_user = UserModel(**updated_user_data)
            print('new_user', new_user)

            result = await self.user_collection.insert_one(new_user.model_dump())
            if result.acknowledged:
                created_user = await self.get_by_id(new_user.id)
                return created_user
            else:
                raise UserCreationError(
                    'User creation failed', 'write operation not acknowledged')

        except UserCreationError as e:
            raise e


class UserUpdater(BaseUserManager):
    async def update_user(
        self,
        updated_data: schemas.UserUpdate
    ) -> schemas.UserInDb | None:
        
        result = await self.user_collection.update_one(
            {'id': updated_data.id},
            {'$set': updated_data.model_dump()}
        )
        if result.matched_count == 1 and result.modified_count == 1:
            updated_user = await self.get_by_id(updated_data.id)
            return updated_user
        return None



class UserDeleter(BaseUserManager):
    async def delete_user(self, id: str):
        user = await self.get_by_id(id)
        deleted_user = await self.user_collection.delete_one({'id': id})

        if deleted_user.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='User not deleted')
        del user['_id']
        print('deleted user', user)
        return user


class User(UserDBManager, UserCreator, UserUpdater, UserDeleter):
    pass
