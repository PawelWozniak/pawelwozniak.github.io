# Using Nebula Logger

This project is using Nebula Logger for saving logs in one centralized place.  
Useful links:  
[Project Github homepage](https://github.com/jongpie/NebulaLogger)  
[Wiki documentation](https://github.com/jongpie/NebulaLogger/wiki)  
[Apex classes documentation](https://jongpie.github.io/NebulaLogger/apex/)

## Exceptions from documentation for quick implementation

Logger class - this is core logging class and can be used in this way:

```java
Logger.info(first arg, second arg, third arg);
Logger.warn(first arg, second arg, third arg);
Logger.error(first arg, second arg, third arg);
Logger.debug(first arg, second arg, third arg);
Logger.fine(first arg, second arg, third arg);
Logger.finer(first arg, second arg, third arg);
Logger.finest(first arg, second arg, third arg);
```

As **first** argument we can provide:

```java
String message  
LogMessage logMessage
```

As **second** argument we can provide:  
* Single or multiple [Database Results](https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_methods_system_database_saveresult.htm):  

```java
Database.DeleteResult deleteResult
Database.MergeResult mergeResult
Database.SaveResult saveResult
Database.UndeleteResult undeleteResult
Database.UpsertResult upsertResult
List<Database.DeleteResult> deleteResults
List<Database.MergeResult> mergeResults
List<Database.SaveResult> saveResults
List<Database.UndeleteResult> undeleteResults
List<Database.UpsertResult> upsertResults
```

* Record or list of records

```java
Id recordId
SObject record
List<SObject> records
```

* Exception only

```java
Exception apexException
```

As a **third** argument we can provide an exception:

```java
Exception apexException
```

## Example usage
* Catch all exceptions from trigger

```java
    try {
        new AccountTH().run();
    }
    catch (Exception e) {
        String rawMsg = '{0} failed with exception: {1}';
        LogMessage logMsg = new LogMessage(rawMsg, 'AccountTH', e.getMessage());
        Logger.error(logMsg, Trigger.new, e); // logMessage, List<SObject>, ApexException
        Logger.saveLog(); // Save log must be added otherwise log won't be saved.
        throw new Utils.triggerException (e, Logger.getTransactionId()); // Re throwing error that end user can see it with Transaction Id.
    }
```

* Save variable states when exception occurred  
Here is small trick done that converts Map to JSON object as logger don't accept such a Map.

```java
    catch (exception e) {
        Map<String, Object> variablesState = new Map<String, Object>();
        variablesState.put('retx', returnX);
        variablesState.put('prcSim', priceSim);
        
        Logger.error('Exception during Pricing Simulation', JSON.serialize(variablesState), e);
        Logger.saveLog();
    }
```

## LogMessage type

[LogMessage](https://jongpie.github.io/NebulaLogger/apex/Logger-Engine/LogMessage) is a separate type where you can provide string with placeholders and values.

Most common usage  
up to 3 inputs:
```java
String rawMsg = 'My string with 3 inputs: {0} and then {1} and finally {2}'; // String with placeholders
LogMessage logMsg = new LogMessage(rawMsg, 'zero', 'first', 'second'); // Values to fill in placeholders
String formattedMessage = logMsg.getMessage(); // Get formatted string from logMessage
```
unlimited inputs:
```java
String rawMsg = 'Exception in class: {0}, timestamp {1}'; // String with placeholders
List<Object> arguments = new List<Object>{'ClassName', System.now()}; // Values to fill in placeholders
LogMessage logMsg = new LogMessage(rawMsg, arguments); // Input for Logger
String formattedMessage = logMsg.getMessage(); // Get formatted string from logMessage
```

## Utility for rethrow errors with transactionId
```java
    public class triggerException extends Exception {
        /**
         * @description rethrow an error with custom message which contains transactionId.
         * @param ex exception thrown in trigger
         * @param transactionId transactionId returned from Logger.getTransactionId(), use it to match code from error message passed by end user with Nebula Logger log entry.
         */
        public triggerException (Exception ex, String transactionId) {
            String message = '**' + transactionId + '**' + ' Caused by: ' + ex.getTypeName() + ': ' + ex.getMessage() + '. # ' + ex.getStackTraceString().split(', column 1')[0] + ' #';
            this.setMessage(message);
        }
    }
```