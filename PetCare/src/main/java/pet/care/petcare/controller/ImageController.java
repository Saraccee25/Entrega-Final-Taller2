package pet.care.petcare.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
public class ImageController {

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        File file = new File("uploads/" + filename);
        
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        FileSystemResource resource = new FileSystemResource(file);
        
        HttpHeaders headers = new HttpHeaders();
        
        String contentType = getContentType(filename);
        headers.setContentType(MediaType.parseMediaType(contentType));
        
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }

    private String getContentType(String filename) {
        if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".gif")) {
            return "image/gif";
        } else {
            return "application/octet-stream";
        }
    }
}
