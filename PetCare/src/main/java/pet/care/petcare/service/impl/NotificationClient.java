package pet.care.petcare.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import pet.care.petcare.entity.Appointment;
import pet.care.petcare.entity.Client;
import pet.care.petcare.entity.Notification;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.repository.IAppointmentRepository;
import pet.care.petcare.repository.INotificationRepository;
import pet.care.petcare.repository.IPetRepository;
import pet.care.petcare.service.IClientService;

@Service
public class NotificationClient {

    @Autowired
    private INotificationRepository notificationRepository;

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPetRepository petRepository ;

    @Autowired
    private IClientService clientService;

    public void createNotifications(long clientId){
        List<Notification> allNotifications = new ArrayList<>(), existingNotifications = notificationRepository.findAll();
        Client client = clientService.findById(clientId);
        for (Appointment appointment : getAllApointments(client)) {
            Notification notification = new Notification();
            notification.setUser(client);
            notification.setMessage("Your pet: " + appointment.getPet().getName() 
                        + " has an appointment with the veterinary: " 
                        + appointment.getClinicStaff().getName() 
                        + " " + appointment.getClinicStaff().getLastname()
                        + " on " + appointment.getDate()
                        + " from " + appointment.getStartTime() 
                        + " to " + appointment.getEndTime() + ".");
            boolean isNewNotification = true;
            for (Notification existingNotification : existingNotifications) {
                if(notification.getMessage().equals(existingNotification.getMessage())){
                    isNewNotification = false;
                }
            }
            if(isNewNotification){
                allNotifications.add(notification);
            }
        }
        notificationRepository.saveAll(allNotifications);
    }

    public void createAppointmentCancellationNotification(LocalDate date, String startTime, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("Pet not found with ID: " + petId));

        String message = String.format("The appointment for your pet %s on %s at %s has been cancelled.",
                pet.getName(), date, startTime);

        Notification notification = new Notification();
        notification.setUser(pet.getClient());
        notification.setMessage(message);
        notification.setDate(LocalDate.now());
        notification.setTime(LocalTime.now());

        notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications(Long clientId){
        Client client = clientService.findById(clientId);
        ArrayList<Notification> activeNotifications = new ArrayList<>();
        for (Notification notification : client.getNotificationList()) {
            if (notification.getReadState() && !notification.getMessage().contains("Reminder")) {
                activeNotifications.add(notification);
            }
        }
        return activeNotifications;
    }
    
    private List<Appointment> getAllApointments(Client client){
        ArrayList<Appointment> appointments = new ArrayList<>();
        for (Pet pet : client.getPets()) {
            appointments.addAll(appointmentRepository.findByPet_Id(pet.getId()));
        }
        return appointments;
    }

    public void updateReadState(Long id, Boolean readState) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
        notification.setReadState(readState);
        notificationRepository.save(notification);
    }

    public Notification updateReminder(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Notification not found with ID: " + id));

        notification.setReminder(LocalDate.now().plusDays(1));

        return notificationRepository.save(notification);
    }

    public void createNotificationForAppointment(Long petId, LocalDate date, LocalTime startTime, Long appointmentId) {
        if (petId == null) {
            throw new IllegalArgumentException("The pet ID is required to create the notification.");
        }

        Optional<Pet> pet = petRepository.findById(petId);
        if (pet.isEmpty() || pet.get().getClient() == null) {
            throw new RuntimeException("The pet or its associated owner was not found.");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

        LocalDate previousDate = appointment.getDate();
        LocalTime previousStartTime = appointment.getStartTime();
        
        String message = String.format(
                "Your pet's appointment has been rescheduled. The previous date was %s at %s, " +
                "and it has been changed to %s at %s.",
                previousDate.toString(), previousStartTime.toString(),
                date.toString(), startTime.toString()
        );

        Long userId = pet.get().getClient().getUserId();

        Notification notification = new Notification();
        notification.setUser(clientService.findById(userId));
        notification.setMessage(message);
        notification.setDate(LocalDate.now());
        notification.setTime(LocalTime.now());

        notificationRepository.save(notification);
    }
    
    public void createRememberAppointment(Long clientId) {
        Set<Notification> rememberNotifications = new HashSet<>();
        Client client = clientService.findById(clientId);
    
        for (Appointment appointment : getAllApointments(client)) {
            long daysBetween = ChronoUnit.DAYS.between(LocalDate.now(), appointment.getDate());
    
            if (daysBetween == 1 || daysBetween == 0) {

                String message = String.format(
                    "Reminder: You have an appointment scheduled for %s at %s.",
                    appointment.getDate().toString(),
                    appointment.getStartTime().toString()
                );
    
                Notification notification = new Notification();
                notification.setUser(client);
                notification.setMessage(message);

                boolean isNewNotification = true;
                for (Notification existingNotification : client.getNotificationList() ) {
                    if(existingNotification.getMessage().equals(message)){
                        isNewNotification = false;
                    } 
                }

                if(isNewNotification){
                    rememberNotifications.add(notification);
                }
            }
        }
        notificationRepository.saveAll(rememberNotifications);  
    }

    public List<Notification> getAllRemindersByClient(Long clientId) {
        Client client = clientService.findById(clientId);

        return client.getNotificationList().stream()
            .filter(notification -> notification.getMessage().contains("Reminder"))
            .filter(Notification::getReadState)
            .collect(Collectors.toList());
    }

    public void deleteNotification(Long id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Notification with ID " + id + " not found");
        }
    }
    


}
