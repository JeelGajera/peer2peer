package dev.ajava.peer2peer.service;

import java.util.List;
import java.util.Optional;

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
            updatedPeer.setName(peer.getName());
            updatedPeer.setFriendList(peer.getFriendList());
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
}