import { LightningElement, api, track } from 'lwc';
import getRelatedTask from '@salesforce/apex/TaskSelectorController.getRelatedTask'
import assignSelectedTaskToProgram from '@salesforce/apex/TaskSelectorController.assignSelectedTaskToProgram'
import searchTask from '@salesforce/apex/TaskSelectorController.searchTask'
import Name from '@salesforce/schema/Task__C.Name';
import Task__c from '@salesforce/schema/Task__C.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SuggestedTask extends LightningElement {
    @track showModal = false;

    modalShown = false;

    @api recordId;

    @track searchData;
    @track taskRecords;
    @track col;
    @track errorMsg = '';
    searchValue = '';
 


    nameField = Name;
    tasks;
    selectedTasks = [];

    col = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Number of days to complete the Task', fieldName: "	Number_of_days_to_complete_the_Task__c"},
        { label: 'Audience Type', fieldName: 'Audience_Type__c' },
    ]

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Audience Type', fieldName: 'Audience_Type__c' },
    ];

    
    
    GetRelatedTask() {
        getRelatedTask({ programId: this.recordId }) 
        .then(tasks => {
            console.log(tasks);
            this.tasks = tasks;
        })
        .catch(error => {
            console.warn(error);
        })
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;

        this.selectedTasks = [];
        for(let i = 0; i<selectedRows.length; i++) {
            this.selectedTasks.push(selectedRows[i].Id);
        }

        console.log(this.selectedTasks);
    }


    get isButtonDisabled() {
        console.log("this is inside the error");
        return this.selectedTasks.length === 0;
    }

    handleAssignSelectedTaskToProgram() {

        assignSelectedTaskToProgram({taskIn: this.selectedTasks, programId: this.recordId})
        .then(response => {
            console.log("selectedTasks");
        })
        .catch(error => {
            //console.warn("");
            console.log("this is inside the error");
        });
            
    }

    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!',
            message: 'New Task Created Successfully!',
            variant: 'success',
        }));
    }


    toggleModal() {
        this.modalShown = !this.modalShown;
    }



    searchKeyword(event) {
        this.searchValue = event.detail.value;
        console.log(this.searchValue);
    }

    handleSearchKeyword() {

        {
            if(!this.searchValue) {
                this.errorMsg = 'Please enter Task name to search.';
                console.log('i am inside searcg')
                this.searchData = undefined;
                return;
            }
    
            searchTask({searchKey : this.searchValue})
            .then(result => {
                result.forEach((record) => {
                    console.log('i am inside task')
                    record.Name = '/' + record.Id;
                });
    
                this.searchData = result;
                
            })
            .catch(error => {
                this.searchData = undefined;
                window.console.log('error =====> '+JSON.stringify(error));
                if(error) {
                    this.errorMsg = error.body.message;
                }
            }) 
        }
        

    }
}
       /* if (this.searchValue !== '') {
            searchTask({
                    searchKey: this.searchValue
                })
                .then(result => {
                    // set @track contacts variable with return contact list from server  
                    this.taskRecords = result;
                })
                .catch(error => {
                   
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    // reset contacts var with null   
                    this.taskRecords = null;
                });
        } else {
            // fire toast event if input field is blank
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search text missing..',
            });
            this.dispatchEvent(event);
        }
    }*/
    
