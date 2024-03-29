﻿using FluentMigrator;

namespace API.FluentMigration.Migrations
{
    [Migration(202302101838)]
    public class CommentTable:Migration
    {
        public const string tableName = "Comment";
        public const string fkNamePerson = "CommentePersonFK";
        public const string fkNamePost = "CommentePostFK";
        public override void Down()
        {
            Delete.Table(tableName);
            Delete.ForeignKey(fkNamePerson);
            Delete.ForeignKey(fkNamePost);
        }

        public override void Up()
        {
            Create.Table(tableName)
                .WithColumn("CommentId").AsInt32().PrimaryKey().NotNullable().Identity()
                .WithColumn("PersonId").AsInt32().NotNullable()
                .WithColumn("PostId").AsInt32().NotNullable()
                .WithColumn("CommentContent").AsString(int.MaxValue).NotNullable()
                .WithColumn("DateOfComment").AsDateTime().NotNullable()
                .WithColumn("Deleted").AsBoolean().NotNullable();

            Create.ForeignKey(fkNamePerson)
                .FromTable(tableName).ForeignColumn("PersonId")
                .ToTable(PersonTable.tableName).PrimaryColumn("PersonId");

            Create.ForeignKey(fkNamePost)
                .FromTable(tableName).ForeignColumn("PostId")
                .ToTable(PostTable.tableName).PrimaryColumn("PostId");
        }
    }
}
