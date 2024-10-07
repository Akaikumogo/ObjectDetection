import React, { useRef, useState, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// Ob'ekt turi
interface DetectedObject {
   bbox: number[]; // [x, y, width, height]
   class: string;
   score: number;
}

const ObjectDetection: React.FC = () => {
   const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
   const [objects, setObjects] = useState<DetectedObject[]>([]);
   const imageRef = useRef<HTMLImageElement | null>(null);

   useEffect(() => {
      const loadModel = async () => {
         const loadedModel = await cocoSsd.load();
         setModel(loadedModel);
      };

      loadModel();
   }, []);

   const detectObjects = async () => {
      if (model && imageRef.current) {
         const predictions = await model.detect(imageRef.current);
         setObjects(predictions as DetectedObject[]); // Typeni qo'llash
      }
   };

   return (
      <div>
         <h2>Object Detection</h2>
         <input
            type="file"
            accept="image/*"
            onChange={(e) => {
               if (e.target.files !== null && e.target.files[0]) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  if (imageRef.current) {
                     imageRef.current.src = url;
                  }
               }
            }}
         />
         <img ref={imageRef} alt="uploaded" onLoad={detectObjects} />
         <ul>
            {objects.map((object, index) => (
               <li key={index}>
                  {object.class}: {Math.round(object.score * 100)}%
               </li>
            ))}
         </ul>
      </div>
   );
};

export default ObjectDetection;
