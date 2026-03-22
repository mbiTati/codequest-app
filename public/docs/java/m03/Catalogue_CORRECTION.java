import java.util.ArrayList;

/**
 * CODEQUEST - Module 03 : POO Fondamentaux
 * ⚠️ CORRECTION — NE PAS DISTRIBUER AUX ÉTUDIANTS
 */
public class Catalogue_CORRECTION {
    
    private ArrayList<Invention_CORRECTION> inventions;
    
    public Catalogue_CORRECTION() {
        this.inventions = new ArrayList<>();
    }
    
    public void ajouter(Invention_CORRECTION inv) {
        inventions.add(inv);
        System.out.println("Ajouté : " + inv.getNom());
    }
    
    public void afficherTout() {
        System.out.println("=== CATALOGUE (" + inventions.size() + " inventions) ===");
        for (Invention_CORRECTION inv : inventions) {
            inv.afficher();
        }
    }
    
    public ArrayList<Invention_CORRECTION> rechercherParCategorie(String categorie) {
        ArrayList<Invention_CORRECTION> resultats = new ArrayList<>();
        for (Invention_CORRECTION inv : inventions) {
            if (inv.getCategorie().equals(categorie)) {
                resultats.add(inv);
            }
        }
        return resultats;
    }
    
    public Invention_CORRECTION trouverPlusAncienne() {
        if (inventions.isEmpty()) return null;
        Invention_CORRECTION plusAncienne = inventions.get(0);
        for (Invention_CORRECTION inv : inventions) {
            if (inv.getAnnee() < plusAncienne.getAnnee()) {
                plusAncienne = inv;
            }
        }
        return plusAncienne;
    }
    
    // BONUS
    public boolean supprimer(String nom) {
        for (int i = 0; i < inventions.size(); i++) {
            if (inventions.get(i).getNom().equals(nom)) {
                inventions.remove(i);
                System.out.println("Supprimé : " + nom);
                return true;
            }
        }
        System.out.println("Non trouvé : " + nom);
        return false;
    }
}
