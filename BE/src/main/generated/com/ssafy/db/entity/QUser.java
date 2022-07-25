package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 846542477L;

    public static final QUser user = new QUser("user");

    public final StringPath userDelYN = createString("userDelYN");

    public final StringPath userEmail = createString("userEmail");

    public final StringPath userMainBadge = createString("userMainBadge");

    public final StringPath userModTime = createString("userModTime");

    public final NumberPath<Integer> userModUserSeq = createNumber("userModUserSeq", Integer.class);

    public final StringPath userName = createString("userName");

    public final StringPath userPassword = createString("userPassword");

    public final StringPath userProfileImage = createString("userProfileImage");

    public final StringPath userRegTime = createString("userRegTime");

    public final NumberPath<Integer> userSeq = createNumber("userSeq", Integer.class);

    public final StringPath userTotalTime = createString("userTotalTime");

    public final NumberPath<Integer> userTotalVideo = createNumber("userTotalVideo", Integer.class);

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

