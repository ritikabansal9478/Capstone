public with sharing class helloo {
    public helloo() {

        //TWO WAYS TO QUERY
        //STATIC QUERY

|}        List<Account> Account = [SELECT Id, createdDate 
                                    FROM ACCOUNT
                                    WHERE CreatedDate = :Date.today() LIMIT 1];

        //Dynamic Query
        Database.query('SELECT Id, Name, CreatedDate FROM Account WHERE CreatedDate = ' + Date.today());
    

    List<Contact> contacts = [SELECT Id, Name, AccountId, Account.Name
                                FROM Contact];

    List<Timesheet__c> timesheets = [SELECT Id, Program__c, program__r.Name
                                        FROM Timesheet__c];

    //for(Timesheet__c t: timesheets) {
      //  System.debug(t.Program__c);
        //System.debug(t.Program__r.Name);
    //}


    //projects and timecards in single query

    List<Program__c> programs = [SELECT Id, Name, (SELECT Name FROM Timesheets__r)
                                    FROM Program__c]; 

    //for(Program__c p : programs) {
      //  for(Timesheet__c t : p.Timesheets__r) {
        //    System.debug(t.Name);
        //}
    //}
}
