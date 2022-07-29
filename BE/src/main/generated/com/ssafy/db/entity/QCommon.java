package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCommon is a Querydsl query type for Common
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QCommon extends EntityPathBase<Common> {

    private static final long serialVersionUID = 1259719725L;

    public static final QCommon common = new QCommon("common");

    public final ListPath<Badge, QBadge> badges = this.<Badge, QBadge>createList("badges", Badge.class, QBadge.class, PathInits.DIRECT2);

    public final NumberPath<Integer> commonSeq = createNumber("commonSeq", Integer.class);

    public final StringPath imgGroup = createString("imgGroup");

    public final StringPath imgName = createString("imgName");

    public final StringPath imgUrl = createString("imgUrl");

    public final ListPath<Studyroom, QStudyroom> studyrooms = this.<Studyroom, QStudyroom>createList("studyrooms", Studyroom.class, QStudyroom.class, PathInits.DIRECT2);

    public QCommon(String variable) {
        super(Common.class, forVariable(variable));
    }

    public QCommon(Path<? extends Common> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCommon(PathMetadata metadata) {
        super(Common.class, metadata);
    }

}

