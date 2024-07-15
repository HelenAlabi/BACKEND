import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertDefined } from "../utilities/assertDefined";



export const getNotes:RequestHandler =  async (req, res, next) => {
    const authenticatedUserId = req.session.userId

    try {
        assertDefined(authenticatedUserId);

    const notes = await NoteModel.find({userId:authenticatedUserId}).exec();
    res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};


export const getNote:RequestHandler = async (req, res, next)=>{
     const noteId = req.params.noteId;
     const authenticatedUserId = req.session.userId

    try {
        assertDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note){
            throw createHttpError(404, "Note not found")
        }
        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You cannot access this note");
        }

        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
};

interface createNoteBody{
    title?: string,
    text? :string,
}


export const createNote :RequestHandler<unknown, unknown, createNoteBody, unknown> = async( req, res, next)=>{
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId


    try {
        assertDefined(authenticatedUserId);

        if (!title){
            throw createHttpError(400, "Title is required");
        }
        const newNote = await NoteModel.create({
            userId:authenticatedUserId,
            title:title,
            text:text,
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};


interface UpdateNoteParams{
    noteId:string,
}

interface UpdateNoteBody{
    title?:string,
    text?:string,
}


export const updateNote:RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody,unknown> = async(req, res, next)=>{
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;
    
    try {
        assertDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id");
        }

        if (!newTitle){
            throw createHttpError(400, "Title is required");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404, "Note not found")
        }

        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You cannot access this note");
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error)
    }
};

export const deleteNote:RequestHandler = async(req, res, next)=>{
       const noteId =  req.params.noteId;
       const authenticatedUserId = req.session.userId;


    try {
        assertDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404, "Note not found");
        }

        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You cannot access this note");
        }

        await NoteModel.findByIdAndDelete(noteId);

        res.sendStatus(204);
    } catch (error) {
       next(error); 
    }
};