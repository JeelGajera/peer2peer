package dev.ajava.peer2peer.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "peer")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeerModel {
    @Id
    private ObjectId id;
    private String name;
    private String email;
    private String profileImg;
    private String peerId;
    private List<String> friendList;
}