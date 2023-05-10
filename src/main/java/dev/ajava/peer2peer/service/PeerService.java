package dev.ajava.peer2peer.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.ajava.peer2peer.model.PeerModel;
import dev.ajava.peer2peer.repository.PeerRepo;

@Service
public class PeerService {

    @Autowired
    private PeerRepo peerRepo;

    public PeerModel saveOrUpdatePeer(PeerModel peer) {
        Optional<PeerModel> existingPeer = peerRepo.findByEmail(peer.getEmail());
        if (existingPeer.isPresent()) {
            PeerModel updatedPeer = existingPeer.get();
            updatedPeer.setName(peer.getName());
            updatedPeer.setPeerId(peer.getPeerId());
            updatedPeer.setFriendList(peer.getFriendList());
            return peerRepo.save(updatedPeer);
        } else {
            return peerRepo.save(peer);
        }
    }
}