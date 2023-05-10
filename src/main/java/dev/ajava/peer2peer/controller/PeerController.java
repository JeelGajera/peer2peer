package dev.ajava.peer2peer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.ajava.peer2peer.model.PeerModel;
import dev.ajava.peer2peer.service.PeerService;

@RestController
@RequestMapping("/api/createPeer")
public class PeerController {
    
    @Autowired
    private PeerService peerService;

    @PostMapping
    public ResponseEntity<PeerModel> createPeer(@RequestBody PeerModel peer) {
        PeerModel savedPeer = peerService.saveOrUpdatePeer(peer);
        return ResponseEntity.ok(savedPeer);
    }
}
