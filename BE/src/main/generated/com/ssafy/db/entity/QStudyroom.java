package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QStudyroom is a Querydsl query type for Studyroom
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStudyroom extends EntityPathBase<Studyroom> {

    private static final long serialVersionUID = -1582391134L;

    public static final QStudyroom studyroom = new QStudyroom("studyroom");

    public final NumberPath<Integer> commonSeq = createNumber("commonSeq", Integer.class);

    public final StringPath roomActiveYN = createString("roomActiveYN");

    public final StringPath roomCloseTime = createString("roomCloseTime");

    public final StringPath roomCloseYN = createString("roomCloseYN");

    public final StringPath roomFullYN = createString("roomFullYN");

    public final NumberPath<Integer> roomLimit = createNumber("roomLimit", Integer.class);

    public final StringPath roomPassword = createString("roomPassword");

    public final StringPath roomPrivateYN = createString("roomPrivateYN");

    public final StringPath roomRegTime = createString("roomRegTime");

    public final NumberPath<Integer> roomSeq = createNumber("roomSeq", Integer.class);

    public final StringPath roomTitle = createString("roomTitle");

    public final NumberPath<Integer> roomType = createNumber("roomType", Integer.class);

    public final NumberPath<Integer> UserSeq = createNumber("UserSeq", Integer.class);

    public QStudyroom(String variable) {
        super(Studyroom.class, forVariable(variable));
    }

    public QStudyroom(Path<? extends Studyroom> path) {
        super(path.getType(), path.getMetadata());
    }

    public QStudyroom(PathMetadata metadata) {
        super(Studyroom.class, metadata);
    }

}

