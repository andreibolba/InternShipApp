﻿
using FluentMigrator;

namespace API.FluentMigration.Migrations
{
    [Migration(202302101759)]
    public class GroupChatMessageTable:Migration
    {
        public const string tableName = "GroupChatMessage";
        public const string fkNamePerson = "GroupChatMessagePersonFK";
        public const string fkNameGroupChat = "GroupChatMessageGroupChatFK";
        public const string fkPictureGroupChat = "GroupChatMessagePictureFK";
        public override void Down()
        {
            Delete.Table(tableName);
            Delete.ForeignKey(fkNamePerson);
            Delete.ForeignKey(fkNameGroupChat);
            Delete.ForeignKey(fkPictureGroupChat);
        }

        public override void Up()
        {
            Create.Table(tableName)
                .WithColumn("GroupChatMessageId").AsInt32().PrimaryKey().NotNullable().Identity()
                .WithColumn("PersonId").AsInt32().NotNullable()
                .WithColumn("GroupChatId").AsInt32().NotNullable()
                .WithColumn("Message").AsString(int.MaxValue).NotNullable()
                .WithColumn("SendDate").AsDateTime().NotNullable()
                .WithColumn("PictureId").AsInt32().Nullable()
                .WithColumn("Deleted").AsBoolean().NotNullable();

            Create.ForeignKey(fkNamePerson)
                .FromTable(tableName).ForeignColumn("PersonId")
                .ToTable(PersonTable.tableName).PrimaryColumn("PersonId");

            Create.ForeignKey(fkNameGroupChat)
                .FromTable(tableName).ForeignColumn("GroupChatId")
                .ToTable(GroupChatTable.tableName).PrimaryColumn("GroupChatId");

            Create.ForeignKey(fkPictureGroupChat)
                .FromTable(tableName).ForeignColumn("PictureId")
                .ToTable(PictureTable.tableName).PrimaryColumn("PictureId");
        }
    }
}
