ALTER TABLE `collection` ADD `order` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
UPDATE `collection` SET `order` = rowid;