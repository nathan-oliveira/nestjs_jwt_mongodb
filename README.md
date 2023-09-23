yarn add @nestjs/jwt jsonwebtoken @nestjs/mongoose mongoose bcrypt class-transformer class-validator @nestjs/passport passport passport-jwt uuid dotenv

nest g module users
nest g controller users --no-spec
nest g service users --no-spec

nest g module auth
nest g service auth --no-spec
