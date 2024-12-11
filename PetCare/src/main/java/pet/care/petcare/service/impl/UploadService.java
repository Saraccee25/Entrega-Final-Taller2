package pet.care.petcare.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Calendar;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadService {

    private final String folder = "uploads/";

    public String saveUpload(MultipartFile file) throws IOException{
        if(!file.isEmpty()){
            int index = file.getOriginalFilename().indexOf(".");
            String extension = file.getOriginalFilename().substring(index + 1);
            byte[] bytes = file.getBytes();
            String encode = URLEncoder.encode(Calendar.getInstance().getTimeInMillis() + "." + extension , StandardCharsets.UTF_8);
            Path path = Paths.get(folder + encode);
            Files.write(path, bytes);
            return encode;
        }
        return null;
    }

    public void deleteUpload(String name){
        File file = new File(folder + name);
        file.delete();
    }
}
