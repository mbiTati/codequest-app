import java.util.ArrayList;

/**
 * Gestion du catalogue d'inventions du laboratoire.
 * Version propre respectant les conventions Java.
 * 
 * @author CodeQuest
 * @version 1.0
 */
public class GestionInventions_PROPRE {

    /** Taux de TVA suisse (7.7%) */
    private static final double TVA = 0.077;

    private ArrayList<String> inventions;
    private int compteur;

    /**
     * Cree un nouveau gestionnaire vide.
     */
    public GestionInventions_PROPRE() {
        this.inventions = new ArrayList<>();
        this.compteur = 0;
    }

    /**
     * Ajoute une invention au catalogue.
     * @param nom le nom de l'invention (non null, non vide)
     */
    public void ajouter(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            System.out.println("Erreur : nom invalide");
            return;
        }
        inventions.add(nom.trim());
        compteur++;
        System.out.println("Ajoute : " + nom.trim());
    }

    /**
     * Affiche toutes les inventions du catalogue.
     */
    public void afficherTout() {
        System.out.println("=== Catalogue (" + compteur + " inventions) ===");
        for (int i = 0; i < inventions.size(); i++) {
            System.out.println("  " + (i + 1) + ". " + inventions.get(i));
        }
    }

    /**
     * Recherche les inventions contenant le mot-cle.
     * @param motCle le texte a rechercher
     * @return liste des inventions correspondantes
     */
    public ArrayList<String> rechercher(String motCle) {
        ArrayList<String> resultats = new ArrayList<>();
        for (String invention : inventions) {
            if (invention.toLowerCase().contains(motCle.toLowerCase())) {
                resultats.add(invention);
            }
        }
        return resultats;
    }

    /**
     * Calcule le prix TTC a partir du prix HT.
     * @param prixHT le prix hors taxes
     * @return le prix avec TVA
     */
    public double calculerPrixTTC(double prixHT) {
        return prixHT * (1 + TVA);
    }

    /**
     * @return le nombre total d'inventions
     */
    public int getCompteur() {
        return compteur;
    }

    public static void main(String[] args) {
        GestionInventions_PROPRE gestion = new GestionInventions_PROPRE();

        gestion.ajouter("Telephone");
        gestion.ajouter("Ampoule");
        gestion.ajouter("Internet");

        gestion.afficherTout();

        System.out.println("\n--- Recherche 'tel' ---");
        for (String resultat : gestion.rechercher("tel")) {
            System.out.println("  Trouve : " + resultat);
        }

        System.out.println("\nPrix TTC de 100 CHF : " + gestion.calculerPrixTTC(100) + " CHF");
    }
}
