trigger ProgramAssignTaskTrigget on Assigned_Programs__c (before insert) {
    if(Trigger.isBefore && Trigger.isInsert) {
        if(DuplicateProgramChecker.checkPrograms(Trigger.new)) {
            AssignAllTasksRelatedToProgram.assignAllTasks(Trigger.new);
        }
        
    }
  
}

