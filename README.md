![Billy](https://raw.github.com/simonlast/playcreator/master/screenshot.png)

#PlayCreator

Storytelling is a unique and powerful way to unleash creativity in both children and adults, while providing a conduit for motivated learning. 

The goal of this project is to create a simple, visually-oriented programming language that generates a play, complete with actors, dialogue, and interaction. The goal is such that a child, upon learning a small set of simple commands, can combine them in fun and complex ways to tell their own stories. 

This project is based upon [Billy](https://github.com/simonlast/billy), another programming language for children.

PlayCreator is released under the MIT License. See LICENSE.md for details.

#[Try it out.](http://playcreator.jit.su/)

##The Language

###Actors
Actors are the basic objects within a program, which are drawn by the user. A program consists of defininitions of these Actors, and manipulations of their state.

To make a new Actor:

	[name] is a [type]

where [name] and [type] can be any string matching [A-Za-z]+

###Attributes

Each Actor has several attributes, which define its appearance.

Each Actor has attributes x, y, left, right, top, bottom, radius, size, height, and width.

###Expressions

An expression alters an Actor's attribute. There are two kinds of expressions: 'set' expressions, and 'move' expressions.

'Set' expressions set a Actor's attribute to a value, and are of the form:

	[name]'s [attribute] is [value]

'Move' expressions move a Actor's attribute by an offset, and are of the form:

	move [name]'s [attribute] [offset]

The "'s" can be omitted.
	
###Dialogue

An Actor can speak using the "say" command, in this form:

	[name] says [text]

A special object, "the narrator," can be used at any time to display dialogue.

###Variables

A variable is a key which is bound to a number. It can be substituted anywhere a number literal is used.

	[key] is [value]

###Extras

	delete [character]
	remove [character]

###That's it!