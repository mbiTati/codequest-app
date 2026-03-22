import java.sql.*;
import java.util.ArrayList;

/**
 * CODEQUEST M13 — Base de Donnees
 * 
 * PREREQUIS :
 * 1. MySQL installe et lance
 * 2. Executer setup_database.sql dans phpMyAdmin
 * 3. Ajouter mysql-connector-j.jar au Build Path Eclipse
 *    (clic-droit projet > Build Path > Add External JARs)
 * 
 * CONSIGNES :
 * 1. Completer ConnexionDB
 * 2. Completer InventionDAO (getTout, ajouter, supprimer, rechercher)
 * 3. Tester dans le main
 */

// ======== CONNEXION ========
class ConnexionDB {
    private static final String URL = "jdbc:mysql://localhost:3306/labo_inventions";
    private static final String USER = "root";
    private static final String PASS = "";  // adapter selon votre config

    public static Connection getConnexion() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}

// ======== DAO ========
class InventionDAO {
    private Connection conn;

    public InventionDAO(Connection conn) {
        this.conn = conn;
    }

    // TODO : recuperer toutes les inventions
    // SELECT * FROM inventions ORDER BY annee
    // Utiliser PreparedStatement + ResultSet
    // Retourner une ArrayList de String (nom + annee)
    public ArrayList<String> getTout() throws SQLException {
        ArrayList<String> liste = new ArrayList<>();
        // VOTRE CODE ICI
        return liste;
    }

    // TODO : ajouter une invention
    // INSERT INTO inventions (nom, annee, inventeur) VALUES (?, ?, ?)
    // Utiliser PreparedStatement avec des ?
    public void ajouter(String nom, int annee, String inventeur) throws SQLException {
        // VOTRE CODE ICI
    }

    // TODO : supprimer par id
    // DELETE FROM inventions WHERE id = ?
    public void supprimer(int id) throws SQLException {
        // VOTRE CODE ICI
    }

    // TODO : rechercher par mot-cle dans le nom
    // SELECT * FROM inventions WHERE nom LIKE ?
    // Hint : ps.setString(1, "%" + motCle + "%")
    public ArrayList<String> rechercher(String motCle) throws SQLException {
        ArrayList<String> resultats = new ArrayList<>();
        // VOTRE CODE ICI
        return resultats;
    }

    // TODO : compter le nombre total
    // SELECT COUNT(*) FROM inventions
    public int compter() throws SQLException {
        // VOTRE CODE ICI
        return 0;
    }
}

// ======== MAIN ========
public class LaboJDBC {
    public static void main(String[] args) {
        try (Connection conn = ConnexionDB.getConnexion()) {
            System.out.println("Connecte a MySQL !");
            InventionDAO dao = new InventionDAO(conn);

            // Tester getTout
            System.out.println("=== Toutes les inventions ===");
            for (String inv : dao.getTout()) {
                System.out.println("  " + inv);
            }

            // Tester ajouter
            dao.ajouter("Machine a vapeur", 1712, "Newcomen");
            System.out.println("Ajoutee !");

            // Tester compter
            System.out.println("Total : " + dao.compter());

            // Tester rechercher
            System.out.println("=== Recherche 'phone' ===");
            for (String inv : dao.rechercher("phone")) {
                System.out.println("  " + inv);
            }

        } catch (SQLException e) {
            System.out.println("Erreur DB : " + e.getMessage());
        }
    }
}
