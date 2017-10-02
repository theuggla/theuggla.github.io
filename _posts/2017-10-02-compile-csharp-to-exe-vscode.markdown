---
url: /compile-csharp-to-exe-vscode
title: the joys of compiling your c# project into a self contained exe from vscode - a frustrated turorial
layout: post
comments: true
---

### the vision

When you want to compile your C# code you've written in vscode, this will at first seem like an easy task - it is not. There are loads of tutorials on how to, which at first seems promising, but they all have one of two fatal flaws: either they explain how to compile a project containing of just one file ("HelloWorld.cs") or they explain how to compile into a dll-file. Whish is all fine and dandy if you want to compile into a dll file and run it on linux of with dotnet installed, but perhaps you just want a single .exe from a bunch of different files to run on Windows and then all hell breaks loose.  

### the hopeful stage

It will probably start with you following one of the .exe tutorials that's out there for a single file, and then it will go as follows:  

You will get an assembly error for your other files in the same namespace ("the namespace blah could not be found, are you missing a using directive or an assembly reference?"). You are getting the assembly reference error because, probably, you haven't included all the files (very deceptive error, somehow the internet tutorials expect everyone to just be aware of this without saying) - if you have more than the "Program.cs" file or whatever the entry point is called, you have to explicitly include. "csc Program.cs model/*.cs view/*.cs controller/*.cs" to include all the files in folders called model, view and controller, for example.  
 
### the frustrated stage
 
Then you do this and you'll be faced with a potential second error - if you included external libraries (for example for persistance, for example Newtonsoft.Json) these will not be found. It still won't work. You'll investigate. You'll drink lots of tea and want to throw stuff.  
 
 
Regardless of what happened with the last step, you'll realize that what you've made won't actually run on a system that does not have dotnet installed already. Since the instructions are to make an exe, we will assume that the program is supposed to run on windows, since that is where exe lives. If you want the program to run on windows without that machine needing to have stuff installed already, you need to make an exe as above, including all of your own files, and placing that in a folder that includes all of the dll-files that your program depends on - these files being all of the "using" direcitives you have in your program, including, but not limited to, the Newtonsoft.Json and all the "System" System.Linq" or whatever references.  


You'll make more tea.  


### the second surge

You'll fins lots of articles on how to accomplish this with something that does not work anymore, from before dotnet decided on compiling with a csproj-file. Then finally you'll find these two articles and rejoice, because they finally explain how to package your exe in a folder together with the dll-files needed:

#### the saviours

#### 1
- https://blogs.msdn.microsoft.com/luisdem/2017/03/19/net-core-1-1-how-to-publish-a-self-contained-application/

#### 2
- https://docs.microsoft.com/en-us/dotnet/core/deploying/deploy-with-cli
docs.microsoft.com

 
### the sad stage 

You'll realize you have to compile it differently for all operating systems and versions of those systems you want it to run on. You will resign to doing this. You will compile for widows 10, 64 bits. You will zip the file. You will email it till the windows computer. You will think it will work.  
 
It will not.  

You will discover the windows power-shell and navigate on the command line to the .exe, trying to run it. You will hope it will work. It will not. You will consider abandoning tea and starting on the whiskey.  
 
You will, in the end, find this lovely person:
~ https://github.com/dotnet/core/issues/759 ~

who had the same issue, and realize that you are not to zip the folder that dotnet creates for you, by the name of windows-64x, in the folder publish, but instead the folder inside of that folder, also named publish.  
 
You will celebrate. You will navigate to the correct directory with windows PowerShell, you will write the name of your .exe and press enter.  
 
It still will not work.  
 

### the end

You will not kill your computer. You will realize that windows does not trust your carefully compiled file (oh, the irony), and you have to write ./Program.exe (or whatever your file is called, starting with the "./") This will finally work. Congratulations!  

### basically

#### 1
Include all of your folders and files when doing csc on the command line, if you don't have external dependecies, including "System".  

#### 2
If you do, compile everything to a folder containing the dll-files needed, for a chosen operating system by following this:
https://docs.microsoft.com/en-us/dotnet/core/deploying/deploy-with-cli or this:  


#### 3 
Zip the folder within the folder within the folder (the lowest level publish folder you can find)  


#### 4
Run it in/with windows PowerShell by command-lineing there as usual and then writing "./Program.exe", substituting "Program" for your actual file name.
