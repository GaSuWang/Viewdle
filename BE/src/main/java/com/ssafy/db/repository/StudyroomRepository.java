package com.ssafy.db.repository;

import com.ssafy.db.entity.Studyroom;
import com.ssafy.db.mapping.StudyroomResMapping;
import org.kurento.client.internal.server.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyroomRepository extends JpaRepository<Studyroom, Long> {

    Studyroom findByroomSeq(int roomSeq);
    List<StudyroomResMapping> findByRoomCloseYN(String enteryn);

//    @Query(value= "select * room_seq, room_type, room_title, room_private_YN, room_password, room_limit, room_reg_time, room_active_YN, room_full_YN from Studyroom \n" +
//            "where room_close_YN = 'Y' and room_type = :type and room_private_YN = :privateYN and room_full_YN = :fullYN order by room_reg_time :order ", nativeQuery = true)
//    List<StudyroomResMapping> findRooms(@Param(value = "type") int type, @Param(value = "privateYN") String privateYN, @Param(value = "fullYN") String fullYN, @Param(value = "order") String order);
}
