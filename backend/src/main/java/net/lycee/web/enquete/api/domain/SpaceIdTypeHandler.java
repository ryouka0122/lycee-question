package net.lycee.web.enquete.api.domain;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(SpaceId.class)
@MappedJdbcTypes({JdbcType.OTHER})
public class SpaceIdTypeHandler extends BaseTypeHandler<SpaceId> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, SpaceId parameter, JdbcType jdbcType) throws SQLException {
        ps.setObject(i, parameter.value());
    }

    @Override
    public SpaceId getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        if (value == null) {
            return null;
        }
        return SpaceId.fromString(value);
    }

    @Override
    public SpaceId getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        if (value == null) {
            return null;
        }
        return SpaceId.fromString(value);
    }

    @Override
    public SpaceId getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        if (value == null) {
            return null;
        }
        return SpaceId.fromString(value);
    }
}
