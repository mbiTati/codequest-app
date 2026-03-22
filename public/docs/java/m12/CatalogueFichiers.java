import java.util.ArrayList;
import java.io.*;

/**
 * CODEQUEST M12 — Fichiers & Crypto
 * 
 * CONSIGNES :
 * 1. Implementer sauvegarder() en format CSV
 * 2. Implementer charger() qui lit le CSV
 * 3. Tester sauvegarde + chargement
 * 4. BONUS : ajouter calculerHash() avec SHA-256
 */
public class CatalogueFichiers {

    private ArrayList<String> noms;
    private ArrayList<Integer> annees;

    public CatalogueFichiers() {
        noms = new ArrayList<>();
        annees = new ArrayList<>();
    }

    public void ajouter(String nom, int annee) {
        noms.add(nom);
        annees.add(annee);
    }

    public void afficher() {
        System.out.println("=== Catalogue (" + noms.size() + " inventions) ===");
        for (int i = 0; i < noms.size(); i++) {
            System.out.println("  " + noms.get(i) + " (" + annees.get(i) + ")");
        }
    }

    // TODO : sauvegarder dans un fichier CSV
    // Format : nom;annee (une invention par ligne, premiere ligne = en-tete)
    // Utiliser try-with-resources + PrintWriter + FileWriter
    public void sauvegarder(String fichier) {
        // VOTRE CODE ICI
        System.out.println("TODO : implementer sauvegarder()");
    }

    // TODO : charger depuis un fichier CSV
    // 1. Vider les listes existantes
    // 2. Lire ligne par ligne avec BufferedReader
    // 3. Sauter la premiere ligne (en-tete)
    // 4. split(";") pour separer nom et annee
    // 5. Ajouter a noms et annees
    // 6. Gerer les erreurs (fichier inexistant, format invalide)
    public void charger(String fichier) {
        // VOTRE CODE ICI
        System.out.println("TODO : implementer charger()");
    }

    // BONUS : calculer le hash SHA-256 du catalogue
    // Concatener tous les noms+annees, puis hasher
    // import java.security.MessageDigest;
    public String calculerHash() {
        // VOTRE CODE ICI
        return "TODO";
    }

    public static void main(String[] args) {
        CatalogueFichiers cat = new CatalogueFichiers();

        // Ajouter des inventions
        cat.ajouter("Telephone", 1876);
        cat.ajouter("Ampoule", 1879);
        cat.ajouter("Internet", 1969);
        cat.ajouter("Java", 1995);

        cat.afficher();

        // Sauvegarder
        cat.sauvegarder("inventions.csv");

        // Creer un nouveau catalogue et charger
        CatalogueFichiers cat2 = new CatalogueFichiers();
        cat2.charger("inventions.csv");
        cat2.afficher(); // Doit afficher les memes inventions !
    }
}
