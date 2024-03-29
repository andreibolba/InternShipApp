﻿using FluentMigrator;

namespace API.FluentMigration.Migrations
{
    [Migration(202304140905)]
    public class PostPicturesTable : Migration
    {
        public const string tableName = "PostPictures";
        public const string fkName = "PostPicturesPostFK";
        public override void Down()
        {
            Delete.Table(tableName);
            Delete.ForeignKey(fkName);
        }

        public override void Up()
        {
            Create.Table(tableName)
                .WithColumn("PostPicturesId").AsInt32().PrimaryKey().NotNullable().Identity()
                .WithColumn("PostId").AsInt32().NotNullable()
                .WithColumn("Picture").AsString(int.MaxValue).Nullable()
                .WithColumn("Deleted").AsBoolean().NotNullable();

            Create.ForeignKey(fkName)
               .FromTable(tableName).ForeignColumn("PostId")
               .ToTable(PostTable.tableName).PrimaryColumn("PostId");
        }
    }
}
