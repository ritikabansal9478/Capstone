public with sharing class TaskSelectorController {

    @AuraEnabled(cacheable=true)
    public static List<Task__c> getRelatedTask(Id programId){
        try {
            
            Program__c prog = [
                        SELECT Id, Audience_Type__c	
                        FROM Program__c
                        WHERE Id = :programId];


            return [
                    SELECT Id, Name, Audience_Type__c	
                    FROM Task__c
                    WHERE Audience_Type__c	includes(:prog.Audience_Type__c)];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }

    @AuraEnabled
    public static List<Tasks_in_Program__c> assignSelectedTaskToProgram(List<Id> taskIn, Id programId ){
        try {

            List<Tasks_in_Program__c> taskInProgram = new List<Tasks_in_Program__c>();

            for(Id tlist : taskIn) {
                Tasks_in_Program__c taskInpro = new Tasks_in_Program__c();
                
                taskInpro.Program__c  = programId;
                taskInpro.Task__c = tlist;

                taskInProgram.add(taskInpro);
            }
            insert taskInProgram;
            return taskInProgram;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Task__c> searchTask(string searchKey) {
         searchKey = '%' + searchKey + '%';
		
       // create contact list to store search result 
        List<Task__c> taskListRecord = new List<Task__c>();
     
	   // query contact records
        for(Task__c queryTask : [Select Id,Name, Audience_Type__c
                                    From Task__c
                                    WHERE Name LIKE : searchKey]){
                    taskListRecord.add(queryTask);
        }
        
         if(taskListRecord.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return taskListRecord;
    }
}
