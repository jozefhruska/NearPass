import { httpsCallable } from 'firebase/functions';
import { functions } from '../index';

export const firestoreHttpsCallable = async (
  functionName,
  data,
) => httpsCallable(functions, functionName)(data)
