CREATE TABLE `button` (
	`id` text PRIMARY KEY NOT NULL,
	`collection_id` text NOT NULL,
	`script` text NOT NULL,
	`label` text NOT NULL,
	`color` text,
	`icon_id` text,
	`order` integer NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `collectionId_idx` ON `button` (`collection_id`);--> statement-breakpoint
CREATE TABLE `collection` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`color` text
);
