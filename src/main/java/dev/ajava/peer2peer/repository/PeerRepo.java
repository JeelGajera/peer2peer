package dev.ajava.peer2peer.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.ajava.peer2peer.model.PeerModel;

@Repository
public interface PeerRepo extends MongoRepository<PeerModel, ObjectId> {

    Optional<PeerModel> findByEmail(String email);
    
}
