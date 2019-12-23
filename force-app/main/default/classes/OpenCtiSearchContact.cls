// public with sharing class OpenCtiSearchContact {
//     public OpenCtiSearchContact() {

//     }
// }
global class OpenCtiSearchContact {
    webService static String getContacts(String phone, String trackingNumber) {
        List<Contact> contactList = new List<Contact>();
        for (Contact contact: [SELECT Id, Phone, Name, Title, Account.Name FROM Contact WHERE (id = :phone OR Name LIKE :('%' + phone + '%') OR firstname LIKE :('%' + phone + '%') OR lastname LIKE :('%' + phone + '%') OR phone LIKE :('%' + phone + '%')) LIMIT 10]){
            contactList.add(contact);
        }
        return JSON.serialize(contactList);
    }
}