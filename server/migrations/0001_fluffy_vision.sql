CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`is_user_message` integer DEFAULT 0 NOT NULL,
	`message_type` text DEFAULT 'text' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`text` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
