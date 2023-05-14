package dev.ajava.peer2peer.controller;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.ajava.peer2peer.model.PeerModel;
import dev.ajava.peer2peer.service.PeerService;

@RestController
@RequestMapping("/api/peer")
public class PeerController {

    @Autowired
    private PeerService peerService;

    // Save or Update Peer
    @PostMapping("/createPeer")
    public ResponseEntity<PeerModel> createPeer(@RequestBody PeerModel peer) {
        PeerModel savedPeer = peerService.saveOrUpdatePeer(peer);
        return ResponseEntity.ok(savedPeer);
    }

    // GET Peer by email
    @GetMapping("/data/{email}")
    public ResponseEntity<PeerModel> getPeerByEmail(@PathVariable String email) {
        Optional<PeerModel> peer = peerService.getPeerByEmail(email);
        if (peer.isPresent()) {
            return ResponseEntity.ok(peer.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update Friendlist by email
    @PostMapping("/update-friend-list")
    public ResponseEntity<String> updateFriendList(
            @RequestParam String hostEmail,
            @RequestParam String friendEmail) {

        try {
            peerService.updateFriendList(hostEmail, friendEmail);
            return ResponseEntity.ok("Friend list updated successfully");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get Friendlist by email
    @GetMapping("/get-friend-list/{email}")
    public ResponseEntity<List<String>> getFriendListByEmail(@PathVariable String email) {
        try {
            return ResponseEntity.ok(peerService.getFriendListByEmail(email));

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Get Id by email
    @GetMapping("/get-id/{email}")
    public ResponseEntity<String> getIdByEmail(@PathVariable String email) {
        try {
            return ResponseEntity.ok(peerService.getIdByEmail(email));

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Get email by Id
    @GetMapping("/get-email/{id}")
    public ResponseEntity<String> getEmailById(@PathVariable ObjectId id) {
        try {
            return ResponseEntity.ok(peerService.getEmailById(id));

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Get User by Id
    @GetMapping("/get-user/{id}")
    public ResponseEntity<Optional<PeerModel>> getUserById(@PathVariable ObjectId id) {
        try {
            return ResponseEntity.ok(peerService.getUserById(id));

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}