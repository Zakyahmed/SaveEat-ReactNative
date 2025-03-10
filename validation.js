// utils/validation.js 
import { useState, useCallback } from 'react';

// Types de validation personnalisés
export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PASSWORD: 'password',
  NAME: 'name',
  PHONE: 'phone',
  POSTAL_CODE: 'postalCode',
  IDE: 'ide', // Numéro d'identification entreprise
};

// Règles de validation détaillées
export const VALIDATION_RULES = {
  [VALIDATION_TYPES.REQUIRED]: {
    regex: /\S+/,
    message: 'Ce champ est obligatoire'
  },
  [VALIDATION_TYPES.EMAIL]: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Adresse email invalide'
  },
  [VALIDATION_TYPES.PASSWORD]: {
    // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Mot de passe trop faible (8+ caractères, maj, min, chiffre, caractère spécial)'
  },
  [VALIDATION_TYPES.NAME]: {
    regex: /^[A-Za-zÀ-ÿ\s'-]{2,50}$/,
    message: 'Nom invalide (2-50 caractères, lettres uniquement)'
  },
  [VALIDATION_TYPES.PHONE]: {
    regex: /^(\+33|0)[1-9](\d{2}){4}$/,
    message: 'Numéro de téléphone français invalide'
  },
  [VALIDATION_TYPES.POSTAL_CODE]: {
    regex: /^\d{5}$/,
    message: 'Code postal invalide (5 chiffres)'
  },
  [VALIDATION_TYPES.IDE]: {
    regex: /^CHE-\d{3}\.\d{3}\.\d{3}$/,
    message: 'Numéro IDE invalide (format: CHE-XXX.XXX.XXX)'
  }
};

/**
 * Validation générique d'un champ
 * @param {string} value - Valeur à valider
 * @param {string|string[]} rules - Règles de validation
 * @returns {string|null} Message d'erreur ou null
 */
export const validateField = (value, rules = []) => {
  // Convertir les règles en tableau si ce n'est pas déjà le cas
  const rulesList = Array.isArray(rules) ? rules : [rules];

  // Parcourir toutes les règles
  for (const rule of rulesList) {
    // Récupérer la règle de validation
    const validationRule = VALIDATION_RULES[rule];

    if (!validationRule) {
      console.warn(`Règle de validation inconnue : ${rule}`);
      continue;
    }

    // Vérification pour les champs requis
    if (rule === VALIDATION_TYPES.REQUIRED && (!value || value.trim() === '')) {
      return validationRule.message;
    }

    // Validation par expression régulière (sauf pour REQUIRED)
    if (rule !== VALIDATION_TYPES.REQUIRED && value) {
      if (!validationRule.regex.test(value)) {
        return validationRule.message;
      }
    }
  }

  // Pas d'erreur
  return null;
};

/**
 * Hook de formulaire personnalisé
 * @param {Object} initialState - État initial du formulaire
 * @returns {Object}/**
 * Hook de formulaire personnalisé
* @param {Object} initialState - État initial du formulaire
* @returns {Object} Utilitaires de gestion de formulaire
*/
export const useForm = (initialState = {}, validationSchema = {}) => {
 // États du formulaire
 const [values, setValues] = useState(initialState);
 const [errors, setErrors] = useState({});
 const [touched, setTouched] = useState({});
 const [isSubmitting, setIsSubmitting] = useState(false);

 /**
  * Modifier la valeur d'un champ
  * @param {string} name - Nom du champ
  * @param {*} value - Valeur du champ
  */
 const handleChange = useCallback((name, value) => {
   setValues(prev => ({
     ...prev,
     [name]: value
   }));

   // Valider le champ si des règles existent
   if (validationSchema[name]) {
     const fieldError = validateField(value, validationSchema[name]);
     setErrors(prev => ({
       ...prev,
       [name]: fieldError
     }));
   }
 }, [validationSchema]);

 /**
  * Marquer un champ comme touché
  * @param {string} name - Nom du champ
  */
 const handleBlur = useCallback((name) => {
   setTouched(prev => ({
     ...prev,
     [name]: true
   }));

   // Validation complète au blur
   if (validationSchema[name]) {
     const fieldError = validateField(values[name], validationSchema[name]);
     setErrors(prev => ({
       ...prev,
       [name]: fieldError
     }));
   }
 }, [validationSchema, values]);

 /**
  * Valider tout le formulaire
  * @returns {Object} Résultat de la validation
  */
 const validateForm = useCallback(() => {
   const newErrors = {};

   // Valider chaque champ avec son schéma
   Object.keys(validationSchema).forEach(name => {
     const value = values[name];
     const fieldError = validateField(value, validationSchema[name]);
     
     if (fieldError) {
       newErrors[name] = fieldError;
     }
   });

   setErrors(newErrors);
   return {
     isValid: Object.keys(newErrors).length === 0,
     errors: newErrors
   };
 }, [validationSchema, values]);

 /**
  * Soumettre le formulaire
  * @param {Function} onSubmit - Callback de soumission
  */
 const handleSubmit = useCallback((onSubmit) => {
   setIsSubmitting(true);
   
   const { isValid, errors } = validateForm();

   if (isValid) {
     try {
       onSubmit(values);
     } catch (submitError) {
       console.error('Erreur de soumission', submitError);
     }
   } else {
     // Marquer tous les champs comme touchés
     const touchedFields = Object.keys(validationSchema).reduce((acc, name) => {
       acc[name] = true;
       return acc;
     }, {});
     setTouched(touchedFields);
   }

   setIsSubmitting(false);
 }, [validateForm, values, validationSchema]);

 /**
  * Réinitialiser le formulaire
  */
 const resetForm = useCallback(() => {
   setValues(initialState);
   setErrors({});
   setTouched({});
   setIsSubmitting(false);
 }, [initialState]);

 return {
   // États
   values,
   errors,
   touched,
   isSubmitting,

   // Méthodes
   handleChange,
   handleBlur,
   handleSubmit,
   resetForm,
   validateForm
 };
};

// Exemples de schémas de validation
export const SCHEMAS = {
 // Schéma pour l'inscription
 REGISTRATION: {
   name: [VALIDATION_TYPES.REQUIRED, VALIDATION_TYPES.NAME],
   email: [VALIDATION_TYPES.REQUIRED, VALIDATION_TYPES.EMAIL],
   password: [VALIDATION_TYPES.REQUIRED, VALIDATION_TYPES.PASSWORD],
   phone: [VALIDATION_TYPES.PHONE], // Optionnel
 },

 // Schéma pour la connexion
 LOGIN: {
   email: [VALIDATION_TYPES.REQUIRED, VALIDATION_TYPES.EMAIL],
   password: [VALIDATION_TYPES.REQUIRED],
 },

 // Schéma pour l'ajout d'un invendu
 ADD_INVENDU: {
   titre: [VALIDATION_TYPES.REQUIRED],
   quantite: [VALIDATION_TYPES.REQUIRED],
   description: [],
   limite: [VALIDATION_TYPES.REQUIRED],
 }
};

// Exemple d'utilisation dans un composant React
/*
const InscriptionScreen = () => {
 const { 
   values, 
   errors, 
   touched, 
   isSubmitting, 
   handleChange, 
   handleBlur, 
   handleSubmit 
 } = useForm(
   { name: '', email: '', password: '', phone: '' }, 
   SCHEMAS.REGISTRATION
 );

 const onSubmit = async (formValues) => {
   try {
     await registerUser(formValues);
     navigation.navigate('Home');
   } catch (error) {
     // Gérer les erreurs de l'API
   }
 };

 return (
   <View>
     <TextInput
       value={values.name}
       onChangeText={(text) => handleChange('name', text)}
       onBlur={() => handleBlur('name')}
       error={touched.name && errors.name}
     />
     {touched.name && errors.name && (
       <Text style={styles.errorText}>{errors.name}</Text>
     )}
     
     <Button 
       onPress={() => handleSubmit(onSubmit)}
       disabled={isSubmitting}
     >
       S'inscrire
     </Button>
   </View>
 );
};
*/

// Exportations pour utilisation
export default {
 validateField,
 useForm,
 VALIDATION_TYPES,
 VALIDATION_RULES,
 SCHEMAS
};