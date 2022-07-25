package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QParticipant is a Querydsl query type for Participant
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QParticipant extends EntityPathBase<Participant> {

    private static final long serialVersionUID = 1767663153L;

    public static final QParticipant participant = new QParticipant("participant");

    public final StringPath participantEnterYN = createString("participantEnterYN");

    public final NumberPath<Integer> participantSeq = createNumber("participantSeq", Integer.class);

    public final StringPath roomOwnerYN = createString("roomOwnerYN");

    public QParticipant(String variable) {
        super(Participant.class, forVariable(variable));
    }

    public QParticipant(Path<? extends Participant> path) {
        super(path.getType(), path.getMetadata());
    }

    public QParticipant(PathMetadata metadata) {
        super(Participant.class, metadata);
    }

}

