import java.util.ArrayList;

/**
 * CODEQUEST - Module 03 : POO Fondamentaux
 * Classe Catalogue (starter code)
 * 
 * Un catalogue gère une collection d'inventions.
 * TODO : Complétez les méthodes
 */
public class Catalogue {
    
    // Un ArrayList est comme un tableau mais de taille DYNAMIQUE
    // On peut ajouter et supprimer des éléments
    private ArrayList<Invention> inventions;
    
    // Constructeur : initialise la liste vide
    public Catalogue() {
        this.inventions = new ArrayList<>();
    }
    
    // ============================================
    // TODO : ajouter(Invention inv)
    // Ajoute une invention à la liste
    // Affiche un message de confirmation
    // ============================================
    
    
    // ============================================
    // TODO : afficherTout()
    // Affiche toutes les inventions du catalogue
    // Utilise un for-each et appelle inv.afficher()
    // ============================================
    
    
    // ============================================
    // TODO : rechercherParCategorie(String categorie)
    // Retourne un ArrayList<Invention> contenant
    // uniquement les inventions de cette catégorie
    // Indice : utiliser .equals() pour comparer les String !
    // ============================================
    
    
    // ============================================
    // TODO : trouverPlusAncienne()
    // Retourne l'Invention avec la plus petite année
    // Retourne null si le catalogue est vide
    // ============================================
    
    
    // ============================================
    // BONUS : supprimer(String nom)
    // Supprime l'invention qui a ce nom
    // Retourne true si trouvée et supprimée, false sinon
    // Attention : utiliser un for classique (pas for-each) 
    // quand on supprime pendant le parcours !
    // ============================================
    
}
