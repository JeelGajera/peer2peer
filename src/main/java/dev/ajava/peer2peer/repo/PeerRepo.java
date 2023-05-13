package dev.ajava.peer2peer.repo;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import dev.ajava.peer2peer.model.PeerModel;

public interface PeerRepo extends MongoRepository<PeerModel, ObjectId> {

    Optional<PeerModel> findByEmail(String email);
    
}
