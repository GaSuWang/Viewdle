package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStudyroom is a Querydsl query type for Studyroom
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QStudyroom extends EntityPathBase<Studyroom> {

    private static final long serialVersionUID = -1582391134L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStudyroom studyroom = new QStudyroom("studyroom");

    public final QCommon common;

    public final ListPath<Participant, QParticipant> participants = this.<Participant, QParticipant>createList("participants", Participant.class, QParticipant.class, PathInits.DIRECT2);

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

    public final QUser user;

    public QStudyroom(String variable) {
        this(Studyroom.class, forVariable(variable), INITS);
    }

    public QStudyroom(Path<? extends Studyroom> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStudyroom(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStudyroom(PathMetadata metadata, PathInits inits) {
        this(Studyroom.class, metadata, inits);
    }

    public QStudyroom(Class<? extends Studyroom> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.common = inits.isInitialized("common") ? new QCommon(forProperty("common")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

