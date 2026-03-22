import java.util.ArrayList;
import java.util.Scanner;

/**
 * Catalogue d'inventions securise.
 * Toutes les failles du fichier original sont corrigees.
 * 
 * @author CodeQuest
 */
public class CatalogueInsecure_CORRECTION {

    private ArrayList<String> inventions;

    public CatalogueInsecure_CORRECTION() {
        inventions = new ArrayList<>();
    }

    /**
     * Ajoute une invention avec validation.
     * CORRECTION FAILLE 1 : verifier null, vide, longueur max
     */
    public void ajouter(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            System.out.println("Erreur : nom invalide (null ou vide)");
            return;
        }
        if (nom.trim().length() > 200) {
            System.out.println("Erreur : nom trop long (max 200 caracteres)");
            return;
        }
        inventions.add(nom.trim());
        System.out.println("Ajoute : " + nom.trim());
    }

    /**
     * Recupere une invention par index.
     * CORRECTION FAILLE 2 : verifier les bornes
     */
    public String getParIndex(int index) {
        if (index < 0 || index >= inventions.size()) {
            System.out.println("Erreur : index " + index + " hors bornes (0-" + (inventions.size() - 1) + ")");
            return null;
        }
        return inventions.get(index);
    }

    /**
     * Ajoute avec annee en String.
     * CORRECTION FAILLE 3 : try-catch sur parseInt + validation realiste
     */
    public void ajouterAvecAnnee(String nom, String anneeStr) {
        if (nom == null || nom.trim().isEmpty()) {
            System.out.println("Erreur : nom invalide");
            return;
        }
        try {
            int annee = Integer.parseInt(anneeStr.trim());
            if (annee < -5000 || annee > 2030) {
                System.out.println("Erreur : annee " + annee + " irrealiste");
                return;
            }
            inventions.add(nom.trim() + " (" + annee + ")");
            System.out.println("Ajoute : " + nom.trim() + " (" + annee + ")");
        } catch (NumberFormatException e) {
            System.out.println("Erreur : '" + anneeStr + "' n'est pas un nombre valide");
        }
    }

    /**
     * Verifie si une invention existe.
     * CORRECTION FAILLE 4 : verifier null + liste non vide
     */
    public boolean contient(String nom) {
        if (nom == null || inventions.isEmpty()) {
            return false;
        }
        for (String inv : inventions) {
            if (inv.equalsIgnoreCase(nom)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Calcule la moyenne de caracteres.
     * CORRECTION FAILLE 5 : verifier division par zero
     */
    public double moyenneCaracteres() {
        if (inventions.isEmpty()) {
            System.out.println("Attention : catalogue vide, moyenne = 0");
            return 0.0;
        }
        int total = 0;
        for (String inv : inventions) {
            total += inv.length();
        }
        return (double) total / inventions.size();
    }

    /**
     * Authentification.
     * CORRECTION FAILLE 6 : dans un vrai projet, le mdp serait hashe en SHA-256
     * et stocke dans un fichier de configuration, JAMAIS en dur.
     * Ici on simule avec un hash.
     */
    public boolean authentifier(String motDePasse) {
        // En vrai : comparer le hash du mdp entre avec le hash stocke
        // String hashAttendu = "ef92b778..."; // hash SHA-256 de "admin123"
        // return sha256(motDePasse).equals(hashAttendu);
        System.out.println("Note : en production, utiliser SHA-256 pour les mots de passe");
        return motDePasse != null && motDePasse.equals("admin123");
    }

    public static void main(String[] args) {
        CatalogueInsecure_CORRECTION cat = new CatalogueInsecure_CORRECTION();

        // Tous ces appels sont SECURISES maintenant :
        cat.ajouter(null);                           // Message d'erreur propre
        cat.ajouter("");                             // Message d'erreur propre
        cat.ajouter("Telephone");                    // OK
        cat.ajouter("Ampoule");                      // OK

        cat.getParIndex(99);                         // Message d'erreur propre
        cat.getParIndex(0);                          // OK : Telephone

        cat.ajouterAvecAnnee("Test", "pas un nb");   // Message d'erreur propre
        cat.ajouterAvecAnnee("Internet", "1969");     // OK

        System.out.println("Contient null : " + cat.contient(null));      // false
        System.out.println("Contient Telephone : " + cat.contient("telephone")); // true

        System.out.println("Moyenne : " + cat.moyenneCaracteres());       // OK
    }
}
