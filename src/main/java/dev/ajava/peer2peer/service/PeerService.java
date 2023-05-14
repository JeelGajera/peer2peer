package dev.ajava.peer2peer.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.ajava.peer2peer.model.PeerModel;
import dev.ajava.peer2peer.repo.PeerRepo;

@Service
public class PeerService {

    @Autowired
    private PeerRepo peerRepo;

    // Save or Update Peer
    public PeerModel saveOrUpdatePeer(PeerModel peer) {
        Optional<PeerModel> existingPeer = peerRepo.findByEmail(peer.getEmail());
        if (existingPeer.isPresent()) {
            PeerModel updatedPeer = existingPeer.get();
            if (updatedPeer.getFriendList() != null && !updatedPeer.getFriendList().isEmpty()) {
                // Preserve the existing friendList
                peer.setFriendList(updatedPeer.getFriendList());
            } else {
                // Initialize the friendList
                updatedPeer.setFriendList(peer.getFriendList());
            }
            updatedPeer.setName(peer.getName());
            return peerRepo.save(updatedPeer);
        } else {
            return peerRepo.save(peer);
        }
    }
    

    // GET Peer by email
    public Optional<PeerModel> getPeerByEmail(String email) {
        return peerRepo.findByEmail(email);
    }

    // Save or Update friend list
    public void updateFriendList(String hostEmail, String friendEmail) {
        Optional<PeerModel> hostPeer = peerRepo.findByEmail(hostEmail);
        if (hostPeer.isPresent()) {
            List<String> friendList = hostPeer.get().getFriendList();
            if (!friendList.contains(friendEmail)) {
                friendList.add(friendEmail);
                hostPeer.get().setFriendList(friendList);
                peerRepo.save(hostPeer.get());
            }
        }
    }

    // Get Friendlist by email
    public List<String> getFriendListByEmail(String email) {
        Optional<PeerModel> peer = peerRepo.findByEmail(email);
        if (peer.isPresent()) {
            return peer.get().getFriendList();
        } else {
            return null;
        }
    }

    //Get Id by email
    public String getIdByEmail(String email) {
        Optional<PeerModel> peer = peerRepo.findByEmail(email);
        if (peer.isPresent()) {
            ObjectId objectId = peer.get().getId();
            return objectId.toString(); // Convert ObjectId to string
        } else {
            return null;
        }
    }

    //Get Email by Id
    public String getEmailById(ObjectId id) {
        Optional<PeerModel> peer = peerRepo.findById(id);
        if (peer.isPresent()) {
            return peer.get().getEmail();
        } else {
            return null;
        }
    }

    //Get User by Id
    public Optional<PeerModel> getUserById(ObjectId id) {
        return peerRepo.findById(id);
    }
}