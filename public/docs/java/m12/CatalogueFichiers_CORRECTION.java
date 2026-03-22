import java.util.ArrayList;
import java.io.*;
import java.security.MessageDigest;

/**
 * Catalogue avec persistance fichier CSV et hash SHA-256.
 * CORRECTION M12.
 * 
 * @author CodeQuest
 */
public class CatalogueFichiers_CORRECTION {

    private ArrayList<String> noms;
    private ArrayList<Integer> annees;

    public CatalogueFichiers_CORRECTION() {
        noms = new ArrayList<>();
        annees = new ArrayList<>();
    }

    public void ajouter(String nom, int annee) {
        if (nom == null || nom.trim().isEmpty()) return;
        noms.add(nom.trim());
        annees.add(annee);
    }

    public void afficher() {
        System.out.println("=== Catalogue (" + noms.size() + " inventions) ===");
        for (int i = 0; i < noms.size(); i++) {
            System.out.println("  " + noms.get(i) + " (" + annees.get(i) + ")");
        }
    }

    /**
     * Sauvegarde le catalogue en format CSV.
     * @param fichier chemin du fichier de sortie
     */
    public void sauvegarder(String fichier) {
        try (PrintWriter pw = new PrintWriter(new FileWriter(fichier))) {
            pw.println("nom;annee");  // en-tete
            for (int i = 0; i < noms.size(); i++) {
                pw.println(noms.get(i) + ";" + annees.get(i));
            }
            System.out.println(noms.size() + " inventions sauvegardees dans " + fichier);
        } catch (IOException e) {
            System.out.println("Erreur sauvegarde : " + e.getMessage());
        }
    }

    /**
     * Charge le catalogue depuis un fichier CSV.
     * @param fichier chemin du fichier a lire
     */
    public void charger(String fichier) {
        noms.clear();
        annees.clear();
        try (BufferedReader br = new BufferedReader(new FileReader(fichier))) {
            br.readLine(); // sauter l'en-tete
            String ligne;
            while ((ligne = br.readLine()) != null) {
                String[] parts = ligne.split(";");
                if (parts.length >= 2) {
                    try {
                        String nom = parts[0].trim();
                        int annee = Integer.parseInt(parts[1].trim());
                        noms.add(nom);
                        annees.add(annee);
                    } catch (NumberFormatException e) {
                        System.out.println("Ligne ignoree (format invalide) : " + ligne);
                    }
                }
            }
            System.out.println(noms.size() + " inventions chargees depuis " + fichier);
        } catch (FileNotFoundException e) {
            System.out.println("Fichier non trouve : " + fichier);
        } catch (IOException e) {
            System.out.println("Erreur lecture : " + e.getMessage());
        }
    }

    /**
     * Calcule le hash SHA-256 du catalogue pour verifier l'integrite.
     * @return le hash en hexadecimal
     */
    public String calculerHash() {
        try {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < noms.size(); i++) {
                sb.append(noms.get(i)).append(annees.get(i));
            }
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(sb.toString().getBytes("UTF-8"));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            return "erreur hash : " + e.getMessage();
        }
    }

    public static void main(String[] args) {
        CatalogueFichiers_CORRECTION cat = new CatalogueFichiers_CORRECTION();

        cat.ajouter("Telephone", 1876);
        cat.ajouter("Ampoule", 1879);
        cat.ajouter("Internet", 1969);
        cat.ajouter("Java", 1995);

        cat.afficher();
        System.out.println("Hash : " + cat.calculerHash());

        // Sauvegarder
        cat.sauvegarder("inventions.csv");

        // Charger dans un nouveau catalogue
        CatalogueFichiers_CORRECTION cat2 = new CatalogueFichiers_CORRECTION();
        cat2.charger("inventions.csv");
        cat2.afficher();
        System.out.println("Hash : " + cat2.calculerHash());

        // Les deux hash doivent etre identiques !
        System.out.println("Integrite OK : " + cat.calculerHash().equals(cat2.calculerHash()));
    }
}
