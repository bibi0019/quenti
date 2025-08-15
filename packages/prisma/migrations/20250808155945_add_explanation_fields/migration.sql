/*
  Warnings:

  - The primary key for the `EntityShare` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `title` on the `Folder` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `Folder` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.
  - You are about to drop the column `containerId` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `studySetId` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `experienceId` on the `StarredTerm` table. All the data in the column will be lost.
  - The primary key for the `StudiableTerm` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `experienceId` on the `StudiableTerm` table. All the data in the column will be lost.
  - You are about to drop the column `folderExperienceId` on the `StudiableTerm` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `StudySet` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `StudySet` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.
  - The `tags` column on the `StudySet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `word` on the `Term` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `definition` on the `Term` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to drop the column `changelogVersion` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `enableUsageData` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AllowedEmailRegex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AutoSaveTerm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FolderExperience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecentFailedLogin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SetAutoSave` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySetExperience` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[entityId,type]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assignmentId]` on the table `StudySet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,submissionId]` on the table `Term` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityId` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containerId` to the `StarredTerm` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Student', 'Teacher');

-- CreateEnum
CREATE TYPE "OrganizationDomainType" AS ENUM ('Base', 'Student');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('Member', 'Admin', 'Owner');

-- CreateEnum
CREATE TYPE "ClassMembershipType" AS ENUM ('Student', 'Teacher');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('Collab');

-- CreateEnum
CREATE TYPE "StudySetCollabType" AS ENUM ('Default', 'Topic');

-- CreateEnum
CREATE TYPE "StudySetType" AS ENUM ('Default', 'Collab');

-- CreateEnum
CREATE TYPE "DistractorType" AS ENUM ('Word', 'Definition');

-- CreateEnum
CREATE TYPE "ContainerType" AS ENUM ('StudySet', 'Folder');

-- AlterEnum
ALTER TYPE "StudySetVisibility" ADD VALUE 'Class';

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AutoSaveTerm" DROP CONSTRAINT "AutoSaveTerm_setAutoSaveId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- DropForeignKey
ALTER TABLE "FolderExperience" DROP CONSTRAINT "FolderExperience_folderId_fkey";

-- DropForeignKey
ALTER TABLE "FolderExperience" DROP CONSTRAINT "FolderExperience_userId_fkey";

-- DropForeignKey
ALTER TABLE "Highscore" DROP CONSTRAINT "Highscore_leaderboardId_fkey";

-- DropForeignKey
ALTER TABLE "Highscore" DROP CONSTRAINT "Highscore_userId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_studySetId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "SetAutoSave" DROP CONSTRAINT "SetAutoSave_userId_fkey";

-- DropForeignKey
ALTER TABLE "StarredTerm" DROP CONSTRAINT "StarredTerm_experienceId_fkey";

-- DropForeignKey
ALTER TABLE "StarredTerm" DROP CONSTRAINT "StarredTerm_termId_fkey";

-- DropForeignKey
ALTER TABLE "StarredTerm" DROP CONSTRAINT "StarredTerm_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudiableTerm" DROP CONSTRAINT "StudiableTerm_experienceId_fkey";

-- DropForeignKey
ALTER TABLE "StudiableTerm" DROP CONSTRAINT "StudiableTerm_folderExperienceId_fkey";

-- DropForeignKey
ALTER TABLE "StudiableTerm" DROP CONSTRAINT "StudiableTerm_termId_fkey";

-- DropForeignKey
ALTER TABLE "StudiableTerm" DROP CONSTRAINT "StudiableTerm_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudySet" DROP CONSTRAINT "StudySet_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudySetExperience" DROP CONSTRAINT "StudySetExperience_studySetId_fkey";

-- DropForeignKey
ALTER TABLE "StudySetExperience" DROP CONSTRAINT "StudySetExperience_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudySetsOnFolders" DROP CONSTRAINT "StudySetsOnFolders_folderId_fkey";

-- DropForeignKey
ALTER TABLE "StudySetsOnFolders" DROP CONSTRAINT "StudySetsOnFolders_studySetId_fkey";

-- DropForeignKey
ALTER TABLE "Term" DROP CONSTRAINT "Term_studySetId_fkey";

-- DropIndex
DROP INDEX "Leaderboard_id_containerId_type_key";

-- AlterTable
ALTER TABLE "EntityShare" DROP CONSTRAINT "EntityShare_pkey",
ADD CONSTRAINT "EntityShare_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2000);

-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "containerId",
DROP COLUMN "folderId",
DROP COLUMN "studySetId",
ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StarredTerm" DROP COLUMN "experienceId",
ADD COLUMN     "containerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudiableTerm" DROP CONSTRAINT "StudiableTerm_pkey",
DROP COLUMN "experienceId",
DROP COLUMN "folderExperienceId",
ADD CONSTRAINT "StudiableTerm_pkey" PRIMARY KEY ("userId", "containerId", "termId", "mode");

-- AlterTable
ALTER TABLE "StudySet" ADD COLUMN     "assignmentId" TEXT,
ADD COLUMN     "cortexStale" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "created" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "StudySetType" NOT NULL DEFAULT 'Default',
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2000),
DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "assetUrl" VARCHAR(255),
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "definitionRichText" JSONB,
ADD COLUMN     "ephemeral" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "explanation" VARCHAR(1000),
ADD COLUMN     "explanationRichText" JSONB,
ADD COLUMN     "submissionId" TEXT,
ADD COLUMN     "topicId" TEXT,
ADD COLUMN     "wordRichText" JSONB,
ALTER COLUMN "word" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "definition" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "changelogVersion",
DROP COLUMN "enableUsageData",
DROP COLUMN "features",
ADD COLUMN     "completedOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isOrgEligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'Student',
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "username" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresInDays" INTEGER,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AllowedEmailRegex";

-- DropTable
DROP TABLE "AutoSaveTerm";

-- DropTable
DROP TABLE "FolderExperience";

-- DropTable
DROP TABLE "RecentFailedLogin";

-- DropTable
DROP TABLE "SetAutoSave";

-- DropTable
DROP TABLE "StudySetExperience";

-- DropEnum
DROP TYPE "EnabledFeature";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoUrl" TEXT,
    "logoHash" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDomain" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "type" "OrganizationDomainType" NOT NULL,
    "requestedDomain" TEXT NOT NULL,
    "domain" TEXT,
    "verifiedEmail" TEXT NOT NULL,
    "otpHash" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "filter" TEXT,

    CONSTRAINT "OrganizationDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingOrganizationInvite" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,

    CONSTRAINT "PendingOrganizationInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orgId" TEXT,
    "logoUrl" TEXT,
    "logoHash" TEXT,
    "bannerColor" TEXT NOT NULL DEFAULT '#ffa54c',
    "bannerUrl" TEXT,
    "bannerHash" TEXT,
    "cortexCategory" TEXT,
    "cortexCourse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassJoinCode" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassJoinCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassMembership" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "ClassMembershipType" NOT NULL,
    "viewedAt" TIMESTAMP(3),
    "sectionId" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClassMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassBan" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "ClassBan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingClassInvite" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "type" "ClassMembershipType" NOT NULL,
    "sectionId" TEXT,

    CONSTRAINT "PendingClassInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassPreferences" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "bannerColor" TEXT,

    CONSTRAINT "ClassPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" "AssignmentType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" JSONB,
    "templateId" TEXT,
    "studySetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "availableAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySetCollaborator" (
    "id" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySetCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySetCollab" (
    "id" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "type" "StudySetCollabType" NOT NULL,
    "minTermsPerUser" INTEGER,
    "maxTermsPerUser" INTEGER,

    CONSTRAINT "StudySetCollab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySetCollabTopic" (
    "id" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,
    "topic" VARCHAR(255) NOT NULL,
    "description" VARCHAR(2000),
    "rank" INTEGER NOT NULL,
    "minTerms" INTEGER NOT NULL,
    "maxTerms" INTEGER NOT NULL,

    CONSTRAINT "StudySetCollabTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySetCollabTopicAssignee" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "minTerms" INTEGER NOT NULL,
    "maxTerms" INTEGER NOT NULL,

    CONSTRAINT "StudySetCollabTopicAssignee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowedClassesOnStudySets" (
    "studySetId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "AllowedClassesOnStudySets_pkey" PRIMARY KEY ("studySetId","classId")
);

-- CreateTable
CREATE TABLE "AllowedSectionsOnStudySets" (
    "studySetId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "AllowedSectionsOnStudySets_pkey" PRIMARY KEY ("studySetId","sectionId")
);

-- CreateTable
CREATE TABLE "StudySetsOnClasses" (
    "studySetId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "StudySetsOnClasses_pkey" PRIMARY KEY ("studySetId","classId")
);

-- CreateTable
CREATE TABLE "FoldersOnClasses" (
    "folderId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "FoldersOnClasses_pkey" PRIMARY KEY ("folderId","classId")
);

-- CreateTable
CREATE TABLE "Distractor" (
    "termId" CHAR(25) NOT NULL,
    "distractingId" CHAR(25) NOT NULL,
    "type" "DistractorType" NOT NULL
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "type" "ContainerType" NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL,
    "shuffleFlashcards" BOOLEAN NOT NULL DEFAULT false,
    "learnRound" INTEGER NOT NULL DEFAULT 0,
    "learnMode" "LearnMode" NOT NULL DEFAULT 'Learn',
    "shuffleLearn" BOOLEAN NOT NULL DEFAULT false,
    "learnQuestionTypes" TEXT NOT NULL DEFAULT '["choice","write"]',
    "studyStarred" BOOLEAN NOT NULL DEFAULT false,
    "answerWith" "StudySetAnswerMode" NOT NULL DEFAULT 'Word',
    "multipleAnswerMode" "MultipleAnswerMode" NOT NULL DEFAULT 'Unknown',
    "extendedFeedbackBank" BOOLEAN NOT NULL DEFAULT false,
    "enableCardsSorting" BOOLEAN NOT NULL DEFAULT false,
    "cardsRound" INTEGER NOT NULL DEFAULT 0,
    "cardsStudyStarred" BOOLEAN NOT NULL DEFAULT false,
    "cardsAnswerWith" "LimitedStudySetAnswerMode" NOT NULL DEFAULT 'Definition',
    "matchStudyStarred" BOOLEAN NOT NULL DEFAULT false,
    "requireRetyping" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationDomain_domain_key" ON "OrganizationDomain"("domain");

-- CreateIndex
CREATE INDEX "OrganizationDomain_orgId_idx" ON "OrganizationDomain"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationDomain_orgId_type_key" ON "OrganizationDomain"("orgId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationDomain_orgId_requestedDomain_key" ON "OrganizationDomain"("orgId", "requestedDomain");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_userId_key" ON "OrganizationMembership"("userId");

-- CreateIndex
CREATE INDEX "OrganizationMembership_orgId_idx" ON "OrganizationMembership"("orgId");

-- CreateIndex
CREATE INDEX "PendingOrganizationInvite_email_idx" ON "PendingOrganizationInvite"("email");

-- CreateIndex
CREATE INDEX "PendingOrganizationInvite_orgId_idx" ON "PendingOrganizationInvite"("orgId");

-- CreateIndex
CREATE INDEX "PendingOrganizationInvite_userId_idx" ON "PendingOrganizationInvite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingOrganizationInvite_orgId_email_key" ON "PendingOrganizationInvite"("orgId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingOrganizationInvite_orgId_userId_key" ON "PendingOrganizationInvite"("orgId", "userId");

-- CreateIndex
CREATE INDEX "Class_orgId_idx" ON "Class"("orgId");

-- CreateIndex
CREATE INDEX "Section_classId_idx" ON "Section"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_classId_name_key" ON "Section"("classId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ClassJoinCode_sectionId_key" ON "ClassJoinCode"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassJoinCode_code_key" ON "ClassJoinCode"("code");

-- CreateIndex
CREATE INDEX "ClassJoinCode_classId_idx" ON "ClassJoinCode"("classId");

-- CreateIndex
CREATE INDEX "ClassMembership_classId_idx" ON "ClassMembership"("classId");

-- CreateIndex
CREATE INDEX "ClassMembership_userId_idx" ON "ClassMembership"("userId");

-- CreateIndex
CREATE INDEX "ClassMembership_sectionId_idx" ON "ClassMembership"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassMembership_classId_userId_key" ON "ClassMembership"("classId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassMembership_email_classId_key" ON "ClassMembership"("email", "classId");

-- CreateIndex
CREATE INDEX "ClassBan_classId_idx" ON "ClassBan"("classId");

-- CreateIndex
CREATE INDEX "ClassBan_userId_idx" ON "ClassBan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassBan_classId_userId_key" ON "ClassBan"("classId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassBan_email_classId_key" ON "ClassBan"("email", "classId");

-- CreateIndex
CREATE INDEX "PendingClassInvite_classId_idx" ON "PendingClassInvite"("classId");

-- CreateIndex
CREATE INDEX "PendingClassInvite_userId_idx" ON "PendingClassInvite"("userId");

-- CreateIndex
CREATE INDEX "PendingClassInvite_email_idx" ON "PendingClassInvite"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingClassInvite_classId_email_key" ON "PendingClassInvite"("classId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "ClassPreferences_membershipId_key" ON "ClassPreferences"("membershipId");

-- CreateIndex
CREATE INDEX "ClassPreferences_membershipId_idx" ON "ClassPreferences"("membershipId");

-- CreateIndex
CREATE INDEX "Assignment_classId_idx" ON "Assignment"("classId");

-- CreateIndex
CREATE INDEX "Assignment_sectionId_idx" ON "Assignment"("sectionId");

-- CreateIndex
CREATE INDEX "Assignment_studySetId_idx" ON "Assignment"("studySetId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_id_classId_key" ON "Assignment"("id", "classId");

-- CreateIndex
CREATE INDEX "Submission_memberId_idx" ON "Submission"("memberId");

-- CreateIndex
CREATE INDEX "Submission_assignmentId_idx" ON "Submission"("assignmentId");

-- CreateIndex
CREATE INDEX "StudySetCollaborator_studySetId_idx" ON "StudySetCollaborator"("studySetId");

-- CreateIndex
CREATE INDEX "StudySetCollaborator_userId_idx" ON "StudySetCollaborator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudySetCollaborator_studySetId_userId_key" ON "StudySetCollaborator"("studySetId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudySetCollab_studySetId_key" ON "StudySetCollab"("studySetId");

-- CreateIndex
CREATE INDEX "StudySetCollabTopic_collabId_idx" ON "StudySetCollabTopic"("collabId");

-- CreateIndex
CREATE INDEX "StudySetCollabTopicAssignee_memberId_idx" ON "StudySetCollabTopicAssignee"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "StudySetCollabTopicAssignee_topicId_memberId_key" ON "StudySetCollabTopicAssignee"("topicId", "memberId");

-- CreateIndex
CREATE INDEX "AllowedClassesOnStudySets_studySetId_idx" ON "AllowedClassesOnStudySets"("studySetId");

-- CreateIndex
CREATE INDEX "AllowedClassesOnStudySets_classId_idx" ON "AllowedClassesOnStudySets"("classId");

-- CreateIndex
CREATE INDEX "AllowedSectionsOnStudySets_studySetId_idx" ON "AllowedSectionsOnStudySets"("studySetId");

-- CreateIndex
CREATE INDEX "AllowedSectionsOnStudySets_sectionId_idx" ON "AllowedSectionsOnStudySets"("sectionId");

-- CreateIndex
CREATE INDEX "StudySetsOnClasses_studySetId_idx" ON "StudySetsOnClasses"("studySetId");

-- CreateIndex
CREATE INDEX "StudySetsOnClasses_classId_idx" ON "StudySetsOnClasses"("classId");

-- CreateIndex
CREATE INDEX "FoldersOnClasses_folderId_idx" ON "FoldersOnClasses"("folderId");

-- CreateIndex
CREATE INDEX "FoldersOnClasses_classId_idx" ON "FoldersOnClasses"("classId");

-- CreateIndex
CREATE INDEX "Distractor_termId_idx" ON "Distractor"("termId");

-- CreateIndex
CREATE UNIQUE INDEX "Distractor_termId_distractingId_type_key" ON "Distractor"("termId", "distractingId", "type");

-- CreateIndex
CREATE INDEX "Container_entityId_idx" ON "Container"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Container_userId_entityId_type_key" ON "Container"("userId", "entityId", "type");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Highscore_userId_idx" ON "Highscore"("userId");

-- CreateIndex
CREATE INDEX "Highscore_leaderboardId_idx" ON "Highscore"("leaderboardId");

-- CreateIndex
CREATE INDEX "Leaderboard_entityId_idx" ON "Leaderboard"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_entityId_type_key" ON "Leaderboard"("entityId", "type");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "StarredTerm_containerId_idx" ON "StarredTerm"("containerId");

-- CreateIndex
CREATE INDEX "StudiableTerm_containerId_idx" ON "StudiableTerm"("containerId");

-- CreateIndex
CREATE INDEX "StudiableTerm_termId_idx" ON "StudiableTerm"("termId");

-- CreateIndex
CREATE UNIQUE INDEX "StudySet_assignmentId_key" ON "StudySet"("assignmentId");

-- CreateIndex
CREATE INDEX "StudySet_userId_idx" ON "StudySet"("userId");

-- CreateIndex
CREATE INDEX "StudySetsOnFolders_studySetId_idx" ON "StudySetsOnFolders"("studySetId");

-- CreateIndex
CREATE INDEX "StudySetsOnFolders_folderId_idx" ON "StudySetsOnFolders"("folderId");

-- CreateIndex
CREATE INDEX "Term_studySetId_idx" ON "Term"("studySetId");

-- CreateIndex
CREATE INDEX "Term_authorId_idx" ON "Term"("authorId");

-- CreateIndex
CREATE INDEX "Term_topicId_idx" ON "Term"("topicId");

-- CreateIndex
CREATE INDEX "Term_submissionId_idx" ON "Term"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Term_id_submissionId_key" ON "Term"("id", "submissionId");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_type_idx" ON "User"("type");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_organizationId_key" ON "VerificationToken"("organizationId");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "VerificationToken"("token");
