package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCoverLetter is a Querydsl query type for CoverLetter
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QCoverLetter extends EntityPathBase<CoverLetter> {

    private static final long serialVersionUID = 625341883L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCoverLetter coverLetter = new QCoverLetter("coverLetter");

    public final StringPath coverLetterContent = createString("coverLetterContent");

    public final StringPath coverLetterRegTime = createString("coverLetterRegTime");

    public final NumberPath<Integer> coverLetterSeq = createNumber("coverLetterSeq", Integer.class);

    public final StringPath coverLetterTitle = createString("coverLetterTitle");

    public final QUser user;

    public QCoverLetter(String variable) {
        this(CoverLetter.class, forVariable(variable), INITS);
    }

    public QCoverLetter(Path<? extends CoverLetter> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCoverLetter(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCoverLetter(PathMetadata metadata, PathInits inits) {
        this(CoverLetter.class, metadata, inits);
    }

    public QCoverLetter(Class<? extends CoverLetter> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

