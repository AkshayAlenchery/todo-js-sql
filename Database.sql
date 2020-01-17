/**
* Name: List Table.
* Desc: Used to store all the Todo lists.
*/
CREATE TABLE "lists" (
  "list_id" SERIAL PRIMARY KEY NOT NULL,
  "list_name" VARCHAR (20) NOT NULL
);

/**
* Name: Todo table.
* Desc: Used to store all the todos of the list.
*/
CREATE TABLE "todos" (
  "todo_id" SERIAL PRIMARY KEY NOT NULL,
  "list_id" INT NOT NULL,
  "todo_name" VARCHAR (20) NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "priority" INT NOT NULL DEFAULT 0,
  "scheduled" VARCHAR (10) DEFAULT null,
  "note" TEXT DEFAULT null
);

ALTER TABLE "todos" ADD FOREIGN KEY ("list_id") REFERENCES "lists" ("list_id") ON DELETE CASCADE;
