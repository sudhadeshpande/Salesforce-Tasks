({
 init : function( component, event, helper ) {    
            
     var actions = [
             { label: 'Edit', name: 'edit', iconName: 'action:edit' },
             { label: 'Show details', name: 'view', iconName: 'action:preview' },
             {label:'Delete', name:'delete', iconName: 'action:delete'}];
     
        component.set( 'v.columns', [    
            {label: 'Name', fieldName: 'Name', sortable:true, type: 'text'},    
            {label: 'First Name', fieldName: 'FirstName', type: 'text', sortable:true, editable:'true' },    
            {label: 'Last Name', fieldName: 'LastName', type: 'text', sortable:true,editable:'true' },
            {label: 'Phone', fieldName: 'Phone', type: 'phone', sortable:true,editable:'true'},
            {label: 'Email', fieldName: 'Email', type: 'email', sortable:true,editable:'true'},
            { type: "action", typeAttributes: { rowActions: actions } }
        ]);    
        helper.fetchContacts(component);  
          
    },  
      
      onSave : function( component, event, helper ) {   
          
        var updatedRecords = component.find( "conTable" ).get( "v.draftValues" );  
        var action = component.get( "c.updatecontacts" );  
        action.setParams({  
              
            'updatedContactList' : updatedRecords  
              
        });  
        action.setCallback( this, function( response ) {  
              
            var state = response.getState();   
            if ( state === "SUCCESS" ) {  
  
                if ( response.getReturnValue() === true ) {  
                      
                    helper.toastMsg( 'success', 'Records Saved Successfully.' );  
                    component.find( "conTable" ).set( "v.draftValues", null );  
                      
                } else {   
                      
                    helper.toastMsg( 'error', 'Something went wrong. Contact your system administrator.' );  
                      
                }  
                  
            } else {  
                  
                helper.toastMsg( 'error', 'Something went wrong. Contact your system administrator.' );  
                  
            }  
              
        });  
        $A.enqueueAction( action );  
          
    },  
    
            /* Search functionality */
    searchTable: function (component, event, helper) {
        var allRecords = component.get("v.allData");
        var searchFilter = event.getSource().get("v.value").toUpperCase();
        var tempArray =[];
        var i;
        for(i=0; i<allRecords.length; i++){
            if((allRecords[i].Name && allRecords[i].Name.toUpperCase().indexOf(searchFilter) != -1) 
               || 
               (allRecords[i].Phone && allRecords[i].Phone.toUpperCase().indexOf(searchFilter) != -1))
            {
                tempArray.push(allRecords[i]);
            }
        }
        component.set("v.contact",tempArray);
    },
    
    updateSorting: function (component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    },
    
    handleRowAction: function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'view':
                helper.viewRecord(cmp, event);
                break;
            case 'edit':
                helper.editRecord(cmp, event);
                break;
            case 'delete':
                helper.deleteRecord(cmp, event);
                break;
        }
    },
    
    handleClick: function(component, event, helper) {
        var createContact = $A.get("e.force:createRecord");
        createContact.setParams({
            "entityApiName": "Contact",
            "defaultFieldValues": {
                "AccountId": component.get("v.recordId")
            }
        });
        createContact.fire();
    },
    
    doselectedRecord: function(cmp,event,helper){
       // alert('record been selected');
       var selectedRows=event.getParam('selectedRows');
       console.log('selectedRows', selectedRows);
    },
    
})
