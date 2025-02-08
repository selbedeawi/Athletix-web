CREATE TABLE `Users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `firstName` LINESTRING NOT NULL,
    `lastName` LINESTRING NOT NULL,
    `userName` LINESTRING NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `role` ENUM('SuperAdmin', 'Sales', 'Receptionist','Coach','SalesManager','SessionManager','Member') NOT NULL,
    `phoneNumber` BIGINT NOT NULL,
    `dateOfBirth` DATE NOT NULL,
    `nationalId` LINESTRING NOT NULL,
    `isFirstTime` BOOLEAN NOT NULL
);
CREATE TABLE `Memberships`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` LINESTRING NOT NULL,
    `Price` BIGINT NOT NULL,
    `FreezePeriod` BIGINT NOT NULL,
    `NumberOfSessions` BIGINT NULL,
    `Invitations` BIGINT NOT NULL,
    `Vistes` BIGINT NOT NULL,
    `BranchId` LONGTEXT NOT NULL,
    `Type` ENUM('') NOT NULL
);
CREATE TABLE `Branch`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` BIGINT NOT NULL
);
CREATE TABLE `BranchMembership`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `BranchId` BIGINT NOT NULL,
    `MemberShipId` BIGINT NOT NULL
);
CREATE TABLE `UserMembership`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `UserId` BIGINT NOT NULL,
    `MembershipId` BIGINT NOT NULL,
    `ActualPrice` BIGINT NOT NULL,
    `ActualFreezePeriod` BIGINT NOT NULL,
    `ActualInvitations` BIGINT NOT NULL,
    `ActualVistes` BIGINT NOT NULL,
    `ActualSessions` BIGINT NOT NULL,
    `StartDate` DATE NOT NULL,
    `ExpiryDate` DATE NOT NULL,
    `IsActive` BOOLEAN NOT NULL,
    `SalesId` BIGINT NOT NULL
);
CREATE TABLE `Sessions`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` LINESTRING NOT NULL,
    `Description` MULTILINESTRING NOT NULL,
    `IsActive` BOOLEAN NOT NULL
);
CREATE TABLE `UserSessions`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `SessionId` BIGINT NOT NULL,
    `UserMemberShipId` BIGINT NOT NULL,
    `BookingDate` DATE NOT NULL,
    `CreatedAt` DATE NOT NULL
);
