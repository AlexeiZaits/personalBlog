CREATE TABLE "Users" (
    "id" UUID PRIMARY KEY,
    "login" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(255),
    "lastname" VARCHAR(255),
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Posts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT,
    "lastname" VARCHAR(255),
    "firstname" VARCHAR(255),
    "mediaUrls" TEXT[],
    "userId" UUID REFERENCES "Users"("id"),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RefreshTokens" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "Users"("id"),
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);