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
    private List<String> friendList;

    public List<String> getFriendList() {
        return friendList;
    }

    public List<String> setFriendList(List<String> friendList) {
        return this.friendList = friendList;
    }

    public String getProfileImg() {
        return profileImg;
    }

    public String setProfileImg(String profileImg) {
        return this.profileImg = profileImg;
    }

    public String getEmail() {
        return email;
    }

    public String setEmail(String email) {
        return this.email = email;
    }

    public String getName() {
        return name;
    }

    public String setName(String name) {
        return this.name = name;
    }
}