# Local Storage vs Database for Storing Recipes: Winner = Local Storage

* Status: accepted 
* Deciders: Sanat
* Date: 11/14/21

## Context and Problem Statement
- Our group was having trouble deciding on the method of storage we would like to use for the recipe book. 
- We considered two options: local storage or a database such as Google Cloud.

## Decision Drivers 
* If we use a database, it is possible to not be able to receive help from the TA.
* If we use a database, it is very overkill for what is necessary for the project.
* If we use local storage, the local storage space is limited.
* If we use local storage, we can't restore data loss.
* If we use local storage, it is quicker for the user.

## Considered Options
* Database (i.e. Firebase, Google Cloud/Drive)
* Local Storage

## Decision Outcome
- Chosen option: Local storage because it is possible to store enough to populate a recipe book and would be easier to manipulate. Also compared to a database, we are able to use the tools we learned in class and are able to utilize them well with help if needed.

### Positive Consequences 
* Fast data access
* Easy data entry
* No overhead

### Negative Consequences 
* Limited storage
* No sharing
* Only key, value storage
* Prone to user manipulation (deletion, etc) 
* Insecure

## Pros and Cons of the Options 

### Databases
{Firebase | no SQL database for storing documents with no set schema | https://firebase.google.com/?gclid=Cj0KCQiAhMOMBhDhARIsAPVml-HwW9ldYZ2ost_AQ0CvgfdQSvGt3eMbjvrPbDNCZ_1GQ2bRtobY3jwaAr34EALw_wcB&gclsrc=aw.ds }

* Good, because hold a lot of information and data
* Good, because does not have a set schema for every document.
* Bad, because so much overhead

### Local Storage
{local storage | local key value store in the broswer | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage }

* Good, because easy to add and remove items
* Good, because no overhead
* Bad, because limited storage
