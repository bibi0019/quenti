-- AlterTable
ALTER TABLE `Container` ADD COLUMN `nextReviewAt` DATETIME(3) NULL,
    ADD COLUMN `spacedDailyLimit` INTEGER NOT NULL DEFAULT 10,
    ADD COLUMN `spacedRound` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `StudiableTerm` DROP PRIMARY KEY,
    MODIFY `mode` ENUM('Flashcards', 'Learn', 'SpacedRepetition') NOT NULL DEFAULT 'Learn',
    ADD PRIMARY KEY (`userId`, `containerId`, `termId`, `mode`);

